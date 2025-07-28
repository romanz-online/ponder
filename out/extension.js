"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    // Register the command for opening detailed demos
    const openDetailedDemoCommand = vscode.commands.registerCommand('ponderWidget.openDetailedDemo', (detailedUrl) => {
        vscode.env.openExternal(vscode.Uri.parse(detailedUrl));
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
        // Check for new format: /// @ponder
        const newFormatMatch = line.text.match(/\/\/\/\s*@ponder\s*$/);
        if (!newFormatMatch)
            return { demo: null, endLine: startLine };
        const demo = {};
        let currentLine = startLine + 1;
        const maxLines = Math.min(startLine + 5, document.lineCount); // Check next 4 lines max
        // Look for /// @preview [link] and /// @detailed [link] in following lines
        while (currentLine < maxLines) {
            const nextLine = document.lineAt(currentLine);
            // Check for @preview
            const previewMatch = nextLine.text.match(/\/\/\/\s*@preview\s+(.+?)(?:\s|$)/);
            if (previewMatch) {
                let previewPath = previewMatch[1].trim();
                // Convert relative paths to file URIs
                if (!previewPath.startsWith('http')) {
                    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
                    if (workspaceFolder) {
                        const fullPath = vscode.Uri.joinPath(workspaceFolder.uri, previewPath);
                        previewPath = fullPath.toString();
                    }
                }
                demo.previewUrl = previewPath;
                currentLine++;
                continue;
            }
            // Check for @detailed
            const detailedMatch = nextLine.text.match(/\/\/\/\s*@detailed\s+(.+?)(?:\s|$)/);
            if (detailedMatch) {
                demo.detailedUrl = detailedMatch[1].trim();
                currentLine++;
                continue;
            }
            // If line doesn't match expected format and isn't a comment, stop parsing
            if (!nextLine.text.match(/^\s*\/\/\//)) {
                break;
            }
            currentLine++;
        }
        // Must have at least one URL
        if (!demo.previewUrl && !demo.detailedUrl)
            return { demo: null, endLine: startLine };
        return {
            demo: {
                previewUrl: demo.previewUrl || demo.detailedUrl,
                detailedUrl: demo.detailedUrl || demo.previewUrl,
                description: demo.description
            },
            endLine: currentLine - 1
        };
    }
    provideCodeLenses(document) {
        const codeLenses = [];
        let i = 0;
        while (i < document.lineCount) {
            const result = this.parsePonderComment(document, i);
            if (result.demo) {
                const range = new vscode.Range(i, 0, result.endLine, document.lineAt(result.endLine).text.length);
                const description = result.demo.description || 'Widget Demo';
                const codeLens = new vscode.CodeLens(range, {
                    title: `🤔 Ponder`,
                    command: 'ponderWidget.openDetailedDemo',
                    arguments: [result.demo.detailedUrl],
                    tooltip: result.demo.previewUrl !== result.demo.detailedUrl
                        ? 'Click for detailed demo, hover for quick preview'
                        : 'Click to view demo, hover for preview'
                });
                codeLenses.push(codeLens);
                i = result.endLine + 1; // Skip to after the parsed block
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
        // Check for new format: /// @ponder
        const newFormatMatch = line.text.match(/\/\/\/\s*@ponder\s*$/);
        if (!newFormatMatch)
            return { demo: null, endLine: startLine };
        const demo = {};
        let currentLine = startLine + 1;
        const maxLines = Math.min(startLine + 5, document.lineCount); // Check next 4 lines max
        // Look for /// @preview [link] and /// @detailed [link] in following lines
        while (currentLine < maxLines) {
            const nextLine = document.lineAt(currentLine);
            // Check for @preview
            const previewMatch = nextLine.text.match(/\/\/\/\s*@preview\s+(.+?)(?:\s|$)/);
            if (previewMatch) {
                let previewPath = previewMatch[1].trim();
                // Convert relative paths to file URIs
                if (!previewPath.startsWith('http')) {
                    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
                    if (workspaceFolder) {
                        const fullPath = vscode.Uri.joinPath(workspaceFolder.uri, previewPath);
                        previewPath = fullPath.toString();
                    }
                }
                demo.previewUrl = previewPath;
                currentLine++;
                continue;
            }
            // Check for @detailed
            const detailedMatch = nextLine.text.match(/\/\/\/\s*@detailed\s+(.+?)(?:\s|$)/);
            if (detailedMatch) {
                demo.detailedUrl = detailedMatch[1].trim();
                currentLine++;
                continue;
            }
            // If line doesn't match expected format and isn't a comment, stop parsing
            if (!nextLine.text.match(/^\s*\/\/\//)) {
                break;
            }
            currentLine++;
        }
        // Must have at least one URL
        if (!demo.previewUrl && !demo.detailedUrl)
            return { demo: null, endLine: startLine };
        return {
            demo: {
                previewUrl: demo.previewUrl || demo.detailedUrl,
                detailedUrl: demo.detailedUrl || demo.previewUrl,
                description: demo.description
            },
            endLine: currentLine - 1
        };
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
            // Check for new format
            if (position.line >= checkLine && position.line <= result.endLine) {
                const commentMatch = line.text.match(/\/\/\/\s*@(ponder|preview|detailed)/);
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
                const description = result.demo.description || 'Widget Demo';
                markdown.appendMarkdown(`**🤔 Ponder**\n\n`);
                markdown.appendMarkdown(`<img src="${result.demo.previewUrl}" width="${previewSize}" alt="${description} Preview"/>\n\n`);
                // Show different message based on whether URLs are different
                if (result.demo.previewUrl !== result.demo.detailedUrl) {
                    markdown.appendMarkdown(`*Hover for quick preview • Click button for detailed demo*`);
                }
                else {
                    markdown.appendMarkdown(`*Hover for preview • Click button to open demo*`);
                }
                return new vscode.Hover(markdown, hoverRange);
            }
        }
        return null;
    }
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map