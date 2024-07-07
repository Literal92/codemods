// BUILT WITH https://codemod.studio

import type { FileInfo, API, Options } from 'jscodeshift';

function transformer(fileInfo: FileInfo, api: API, options: Options) {
    const j = api.jscodeshift;
    const root = j(fileInfo.source);

    // Find all import declarations from '@angular/material'
    root.find(j.ImportDeclaration)
        .filter((path) => path.node.source.value === '@angular/material')
        .forEach((path) => {
            // Get the list of imported specifiers
            const specifiers = path.node.specifiers;

            // Create new import statements for each specifier
            const newImports = specifiers
                ?.map((specifier) => {
                    if (specifier.type === 'ImportSpecifier') {
                        const importedModule = specifier.imported.name;
                        return j.importDeclaration(
                            [j.importSpecifier(j.identifier(importedModule))],
                            j.stringLiteral(
                                `@angular/material/${importedModule
                                    .split(/(?=[A-Z])/)[1]
                                    ?.toLowerCase()}`,
                            ),
                        );
                    }
                    return null;
                })
                .filter(Boolean);

            if (newImports) {
                // Replace the old import with the new ones
                j(path).replaceWith(newImports);
            }
        });

    return root.toSource();
}

export default transformer;
