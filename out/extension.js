"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    // Register the command for opening detailed demos
    const openDetailedDemoCommand = vscode.commands.registerCommand('ponderWidget.openDetailedDemo', (detailedUrl) => {
        const uri = vscode.Uri.parse(detailedUrl);
        // If it's a local file URI, open in VS Code
        if (uri.scheme === 'file') {
            vscode.commands.executeCommand('vscode.open', uri);
        }
        else {
            // If it's a web URL, open externally
            vscode.env.openExternal(uri);
        }
    });
    // Create code lens provider
    const codeLensProvider = new PonderCodeLensProvider();
    const codeLensProviderDisposable = vscode.languages.registerCodeLensProvider({ scheme: 'file', language: 'dart' }, codeLensProvider);
    // Create hover provider for preview
    const hoverProvider = new PonderHoverProvider();
    const hoverProviderDisposable = vscode.languages.registerHoverProvider({ scheme: 'file', language: 'dart' }, hoverProvider);
    context.subscriptions.push(openDetailedDemoCommand, codeLensProviderDisposable, hoverProviderDisposable);
}
exports.activate = activate;
class PonderCodeLensProvider {
    parsePonderComment(document, startLine) {
        const line = document.lineAt(startLine);
        // Check for single-line format: /// @ponder [path]
        const singleLineMatch = line.text.match(/\/\/\/\s*@ponder\s+(.+?)(?:\s|$)/);
        if (singleLineMatch) {
            let ponderPath = singleLineMatch[1].trim();
            // Convert relative paths to file URIs
            if (!ponderPath.startsWith('http')) {
                const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
                if (workspaceFolder) {
                    const fullPath = vscode.Uri.joinPath(workspaceFolder.uri, ponderPath);
                    ponderPath = fullPath.toString();
                }
            }
            return {
                demo: {
                    previewUrl: ponderPath,
                },
                endLine: startLine
            };
        }
        return { demo: null, endLine: startLine };
    }
    provideCodeLenses(document) {
        const codeLenses = [];
        let i = 0;
        while (i < document.lineCount) {
            const result = this.parsePonderComment(document, i);
            if (result.demo) {
                const range = new vscode.Range(i, 0, result.endLine, document.lineAt(result.endLine).text.length);
                const codeLens = new vscode.CodeLens(range, {
                    title: `🤔 Ponder`,
                    command: 'ponderWidget.openDetailedDemo',
                    arguments: [result.demo.previewUrl],
                    tooltip: 'Click to open demo'
                });
                codeLenses.push(codeLens);
                i = result.endLine + 1;
            }
            else {
                i++;
            }
        }
        return codeLenses;
    }
}
class PonderHoverProvider {
    parsePonderComment(document, startLine) {
        const line = document.lineAt(startLine);
        // Check for single-line format: /// @ponder [path]
        const singleLineMatch = line.text.match(/\/\/\/\s*@ponder\s+(.+?)(?:\s|$)/);
        if (singleLineMatch) {
            let ponderPath = singleLineMatch[1].trim();
            // Convert relative paths to file URIs
            if (!ponderPath.startsWith('http')) {
                const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
                if (workspaceFolder) {
                    const fullPath = vscode.Uri.joinPath(workspaceFolder.uri, ponderPath);
                    ponderPath = fullPath.toString();
                }
            }
            return {
                demo: {
                    previewUrl: ponderPath,
                },
                endLine: startLine
            };
        }
        return { demo: null, endLine: startLine };
    }
    provideHover(document, position) {
        // Check if current line might be start of a ponder comment block
        let checkLine = position.line;
        let result = this.parsePonderComment(document, checkLine);
        // If not found on current line, check a few lines back in case we're hovering over a @preview or @detailed line
        if (!result.demo && checkLine > 0) {
            for (let i = 1; i <= 4 && checkLine - i >= 0; i++) {
                result = this.parsePonderComment(document, checkLine - i);
                if (result.demo && result.endLine >= position.line) {
                    checkLine = checkLine - i;
                    break;
                }
            }
        }
        if (result.demo) {
            const line = document.lineAt(position.line);
            // Check if hover is over any part of the ponder comment block
            let isOverComment = false;
            let hoverRange;
            // Check for single-line format
            if (position.line >= checkLine && position.line <= result.endLine) {
                const commentMatch = line.text.match(/\/\/\/\s*@ponder/);
                if (commentMatch) {
                    isOverComment = true;
                    hoverRange = new vscode.Range(checkLine, 0, result.endLine, document.lineAt(result.endLine).text.length);
                }
            }
            if (isOverComment) {
                const config = vscode.workspace.getConfiguration('ponderWidget');
                const previewSize = config.get('hoverPreviewSize', 200);
                const markdown = new vscode.MarkdownString();
                markdown.isTrusted = true;
                markdown.supportHtml = true;
                markdown.appendMarkdown(`**🤔 Ponder**\n\n`);
                markdown.appendMarkdown(`<img src="${result.demo.previewUrl}" width="${previewSize}"/>`);
                return new vscode.Hover(markdown, hoverRange);
            }
        }
        return null;
    }
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map