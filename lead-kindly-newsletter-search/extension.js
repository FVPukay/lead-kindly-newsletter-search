const vscode = require('vscode');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
	// Retrieves the last 20 substack posts from the RSS feed
	// Substack does not support pagination and does not have a public API
	const res = await axios.get('https://coltino.substack.com/feed');
	const parser = new XMLParser();
	const articles = parser.parse(res.data).rss.channel.item.map(
		article => {
			return {
				label: article.title,
				detail: article.description,
				link: article.link,
			};
		});

		const disposable = vscode.commands.registerCommand(
			'lead-kindly-newsletter-search.searchLeadKindly', async () => {
				const article = await vscode.window.showQuickPick(articles, {
					matchOnDetail: true,
			});
	
			if (article == null) return;
			vscode.env.openExternal(article.link);
	
		});
		
	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
