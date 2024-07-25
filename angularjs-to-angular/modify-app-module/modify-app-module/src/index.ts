import type { API, FileInfo, Options } from 'jscodeshift';

function transform(
    file: FileInfo,
    api: API,
    options: Options,
): string | undefined {
    const j = api.jscodeshift;
    const root = j(file.source);
    let dirtyFlag = false;

    // Add UpgradeModule import if not already present
    const upgradeModuleImport = j.importDeclaration(
        [j.importSpecifier(j.identifier('UpgradeModule'))],
        j.literal('@angular/upgrade/static'),
    );

    const existingUpgradeModuleImport = root.find(j.ImportDeclaration, {
        source: { value: '@angular/upgrade/static' },
    });

    if (existingUpgradeModuleImport.size() === 0) {
        // Insert the new import after the last import statement
        root.find(j.ImportDeclaration).at(-1).insertAfter(upgradeModuleImport);
        dirtyFlag = true;
    }

    // Add UpgradeModule to NgModule imports array
    root.find(j.Decorator, {
        expression: {
            callee: { name: 'NgModule' },
        },
    }).forEach((path) => {
        const expression = path.value.expression;
        if (j.CallExpression.check(expression)) {
            const args = expression.arguments;
            if (args.length > 0 && j.ObjectExpression.check(args[0])) {
                const properties = args[0].properties;
                properties.forEach((prop) => {
                    if (
                        j.Property.check(prop) &&
                        j.Identifier.check(prop.key) &&
                        prop.key.name === 'imports'
                    ) {
                        if (j.ArrayExpression.check(prop.value)) {
                            const elements = prop.value.elements;
                            const hasUpgradeModule = elements.some(
                                (el) =>
                                    j.Identifier.check(el) &&
                                    el.name === 'UpgradeModule',
                            );
                            if (!hasUpgradeModule) {
                                elements.push(j.identifier('UpgradeModule'));
                                dirtyFlag = true;
                            }
                        }
                    }
                });
            }
        }
    });

    if (!dirtyFlag) {
        return undefined;
    }

    return root.toSource({ ...options, quote: 'single' });
}

export default transform;
