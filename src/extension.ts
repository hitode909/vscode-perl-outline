import * as vscode from 'vscode';

import { PerlDocumentSymbolProvider } from './documentSymbolProvider';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.languages.registerDocumentSymbolProvider(
			[
				{ language: 'perl', pattern: '**/*.{pm,pl,t,ph}' },
				{ language: 'perl', scheme: 'untitled' },
			],
			new PerlDocumentSymbolProvider()
		)
	);
}

export function deactivate() {
}