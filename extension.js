const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function activate(context) {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
  statusBarItem.text = "Knight";
  statusBarItem.tooltip = "Knight Framework Tools";
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  context.subscriptions.push(vscode.commands.registerCommand(
    "extension.createKnightScript",
    async function () {
      const fileName = await vscode.window.showInputBox({
        prompt: "Enter script name",
        placeHolder: "KnightClass",
      });

      if (!fileName) return;

      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) return  vscode.window.showErrorMessage("No workspace folder open");

      const filePath = path.join(
        workspaceFolders[0].uri.fsPath,
        `${fileName}.luau`
      );

      try {
        const templatePath = path.join(__dirname, "template.luau");
        let content = fs.readFileSync(templatePath, "utf8");
        content = content.replace(/<filename>/g, fileName);

        fs.writeFileSync(filePath, content);

        const doc = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(doc);

        vscode.window.showInformationMessage(
          `Created new Knight script: ${fileName}`
        );
      } catch (err) {
        vscode.window.showErrorMessage(
          `Failed to create script: ${err.message}`
        );
      }
    }
  ));
  
  context.subscriptions.push(vscode.commands.registerCommand(
    "extension.replaceScript",
    async function () {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const fileName = editor.document.fileName.toLowerCase();

      if (!fileName.endsWith(".lua") && !fileName.endsWith(".luau"))
        return vscode.window.showWarningMessage(
          "For safety and security this command only works on .lua or .luau files."
        );

      const askToConfirm = vscode.workspace
        .getConfiguration("vsc-knight")
        .get("askToConfirmAutofill");

      if (askToConfirm) {
        const confirm = await vscode.window.showWarningMessage(
          "Replace the entire contents of this script with the template?",
          { modal: true },
          "Yes"
        );

        if (confirm !== "Yes") return;
      }

      const templatePath = path.join(__dirname, "template.luau");
      let templateText;

      try {
        templateText = fs.readFileSync(templatePath, "utf8");
        templateText = templateText.replace(
          /<filename>/g,
          path.basename(editor.document.fileName, path.extname(editor.document.fileName))
        );
      } catch (err) {
        vscode.window.showErrorMessage(`Error: ${err.message}`);
        statusBarItem.text = "Knight ✕";
        setTimeout(() => {
          statusBarItem.text = "Knight";
        }, 2000);
        return;
      }

      const fullRange = new vscode.Range(
        editor.document.positionAt(0),
        editor.document.positionAt(editor.document.getText().length)
      );

      editor.edit((editBuilder) => {
        editBuilder.replace(fullRange, templateText);
      });

      vscode.window.showInformationMessage("Template applied successfully!");
      statusBarItem.text = "Knight ✓";
      setTimeout(() => {
        statusBarItem.text = "Knight";
      }, 2000);
    }
  ));
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
