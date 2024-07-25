
import type { API, FileInfo, Options } from 'jscodeshift';

function transform(file: FileInfo, api: API, options: Options): string | undefined {
    const j = api.jscodeshift;
    const root = j(file.source);
    let dirtyFlag = false;

    // Add new imports
    const newImports = [
        j.importDeclaration(
            [j.importSpecifier(j.identifier('UpgradeModule'))],
            j.literal('@angular/upgrade/static')
        ),
        j.importDeclaration(
            [j.importSpecifier(j.identifier('downgradeComponent'))],
            j.literal('@angular/upgrade/static')
        ),
        j.importDeclaration(
            [j.importDefaultSpecifier(j.identifier('angular'))],
            j.literal('angular')
        ),
        j.importDeclaration(
            [j.importSpecifier(j.identifier('myAngularJSAppModule'))],
            j.literal('./angularjs/app.module')
        )
    ];

    // Insert new imports after existing imports
    const lastImport = root.find(j.ImportDeclaration).at(-1);
    if (lastImport.size() > 0) {
        lastImport.insertAfter(newImports);
    } else {
        root.get().node.program.body.unshift(...newImports);
    }
    dirtyFlag = true;

    // Modify platformBrowserDynamic().bootstrapModule(AppModule)
    root.find(j.CallExpression, {
        callee: {
            type: 'MemberExpression',
            object: { callee: { name: 'platformBrowserDynamic' } },
            property: { name: 'bootstrapModule' }
        }
    }).forEach(path => {
        const bootstrapCall = path.node;
        if (bootstrapCall.arguments.length === 1) {
            const appModule = bootstrapCall.arguments[0];
            const thenBlock = j.blockStatement([
                j.variableDeclaration('const', [
                    j.variableDeclarator(
                        j.identifier('upgrade'),
                        j.tsAsExpression(
                            j.callExpression(
                                j.memberExpression(
                                    j.memberExpression(
                                        j.identifier('platformRef'),
                                        j.identifier('injector')
                                    ),
                                    j.identifier('get')
                                ),
                                [j.identifier('UpgradeModule')]
                            ),
                            j.tsTypeReference(j.identifier('UpgradeModule'))
                        )
                    )
                ]),
                j.expressionStatement(
                    j.callExpression(
                        j.memberExpression(
                            j.identifier('upgrade'),
                            j.identifier('bootstrap')
                        ),
                        [
                            j.memberExpression(
                                j.identifier('document'),
                                j.identifier('body')
                            ),
                            j.arrayExpression([
                                j.memberExpression(
                                    j.identifier('myAngularJSAppModule'),
                                    j.identifier('name')
                                )
                            ])
                        ]
                    )
                )
            ]);

            const newThen = j.callExpression(
                j.memberExpression(
                    bootstrapCall,
                    j.identifier('then')
                ),
                [
                    j.arrowFunctionExpression(
                        [j.identifier('platformRef')],
                        thenBlock
                    )
                ]
            );

            path.replace(newThen);
            dirtyFlag = true;
        }
    });

    if (!dirtyFlag) {
        return undefined;
    }
    return root.toSource(options);
}

export default transform;
