import * as core from "@actions/core";
import axios from "axios";
import { AuthClient, JWT } from "google-auth-library";
import { google } from "googleapis";

async function run(): Promise<void> {
  try {
    // Retrieve project name.
    const projectName: string = core.getInput("project-name");

    core.debug(`Project name: \`${projectName}\``);

    const serviceAccountEMail: string = core.getInput("service-account-email");
    const serviceAccountPrivateKey: string = core.getInput(
      "service-account-private-key"
    );

    const sheetId: string = core.getInput("sheet-id");

    if (
      !projectName ||
      !serviceAccountEMail ||
      !serviceAccountPrivateKey ||
      !sheetId
    )
      core.setFailed("Missing information, can't proceed.");

    const googleAuth = new JWT(
      serviceAccountEMail,
      undefined,
      serviceAccountPrivateKey,
      ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    );

    // Initialize sheets credentials.
    const sheetsAPI = google.sheets({
      version: "v4",
      auth: googleAuth,
    });

    const result = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Mappings",
    });

    if (!result.data.values || !result.data.values.length)
      throw new Error("No data found");

    const projectRow = result.data.values.find(
      ([service]) => service === projectName
    );

    if (!projectRow?.length)
      throw new Error(
        `Webhook URL not found for project name \`${projectName}\``
      );

    await axios.post(projectRow[1], {
      text: `🍆 Project "${projectName}" deployed!`,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
