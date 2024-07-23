import type { API, FileInfo, Options } from 'jscodeshift';

function transform(
    file: FileInfo,
    api: API,
    options: Options,
): string | undefined {
    const j = api.jscodeshift;
    const root = j(file.source);

    // Find all controller definitions
    const controllers = root.find(j.CallExpression, {
        callee: {
            object: {
                object: { name: 'angular' },
                property: { name: 'module' },
            },
            property: { name: 'controller' },
        },
    });

    // Remove all controller definitions except 'PersonCreateController'
    controllers.forEach((path) => {
        const args = path.value.arguments;
        if (
            args.length > 0 &&
            j.Literal.check(args[0]) &&
            args[0].value !== 'PersonCreateController'
        ) {
            j(path).remove();
        }
    });

    return root.toSource(options);
}

export default transform;
