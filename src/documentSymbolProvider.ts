
import * as vscode from 'vscode';

/* respect https://github.com/Gimly/vscode-fortran/blob/229cddce53a2ea0b93032619efeef26376cd0d2c/src/documentSymbolProvider.ts */
export class PerlDocumentSymbolProvider implements vscode.DocumentSymbolProvider {

    public provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken): vscode.SymbolInformation[] {

        const functionRegex = /\b(package|sub)\b +([^ ;]+)/;

        const result: vscode.SymbolInformation[] = [];

        const table:{[name: string]: vscode.SymbolKind} = {
            package: vscode.SymbolKind.Class,
            sub: vscode.SymbolKind.Function,
        };

        for (let line = 0; line < document.lineCount; line++) {
            const { text } = document.lineAt(line);

            const matched = text.match(functionRegex);
            if (matched) {
                const type = matched[1];
                const name = matched[2];
                const kind = table[type];
                if (!kind) {
                    continue;
                }
                result.push(
                    new vscode.SymbolInformation(
                        name,
                        kind,
                        '',
                        new vscode.Location(document.uri, new vscode.Position(line, 0))
                    )
                );
            }
        }

        return result;
    }
}