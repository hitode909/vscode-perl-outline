
import * as vscode from 'vscode';

/* respect https://github.com/Gimly/vscode-fortran/blob/229cddce53a2ea0b93032619efeef26376cd0d2c/src/documentSymbolProvider.ts
           https://github.com/Microsoft/vscode/blob/34ba2e2fbfd196e2d6db5a4db0e42d03a97c655e/extensions/markdown-language-features/src/features/documentLinkProvider.ts
 */
export class PerlDocumentSymbolProvider implements vscode.DocumentSymbolProvider {

    public provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken): vscode.SymbolInformation[] {

        const tokenToKind = this.tokenToKind;

        const text = document.getText();
        const matchedList = this.matchAll(this.pattern, text);

        return matchedList.map((matched) => {
            const type = matched[1];
            const name = matched[2];
            const kind = tokenToKind[type];

            const position = document.positionAt(matched.index || 0);
            return new vscode.SymbolInformation(
                name,
                kind,
                '',
                new vscode.Location(document.uri, position)
            );
        });
    }

    private get tokenToKind(): { [name: string]: vscode.SymbolKind; } {
        return {
            package: vscode.SymbolKind.Class,
            sub: vscode.SymbolKind.Function,
        };
    }

    private get pattern() {
        return /\b(package|sub)\b +([^ ;\n]+)/g;
    }

    private matchAll(
        pattern: RegExp,
        text: string
    ): Array<RegExpMatchArray> {
        const out: RegExpMatchArray[] = [];
        pattern.lastIndex = 0;
        let match: RegExpMatchArray | null;
        while ((match = pattern.exec(text))) {
            console.log(match);
            out.push(match);
        }
        return out;
    }
}