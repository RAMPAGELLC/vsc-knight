const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function activate(context) {
  let disposable = vscode.commands.registerCommand("extension.replaceScript", async function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const fileName = editor.document.fileName.toLowerCase();

    if (!fileName.endsWith(".lua") && !fileName.endsWith(".luau")) return vscode.window.showWarningMessage("For safety and security this command only works on .lua or .luau files.");

    const confirm = await vscode.window.showWarningMessage(
      "Replace the entire contents of this script with the template?",
      { modal: true },
      "Yes"
    );

    if (confirm !== "Yes") return;

    const templatePath = path.join(__dirname, "template.luau");
    let templateText;

    try {
      templateText = fs.readFileSync(templatePath, "utf8");
    } catch (err) {
      vscode.window.showErrorMessage("Template file not found.");
      return;
    }

    const fullRange = new vscode.Range(
      editor.document.positionAt(0),
      editor.document.positionAt(editor.document.getText().length)
    );

    editor.edit(editBuilder => {
      editBuilder.replace(fullRange, templateText);
    });
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};