import { exec as execSync } from "child_process";
import { promisify } from "util";

const exec = promisify(execSync);

export const getAngularLatestVersion = async () => {
    let version = "19.2.3";

    try {
        const { stdout, stderr } = await exec("npm view @angular/core version");

        if (stderr) {
            throw new Error(`exec error: ${stderr}`);
        }

        version = stdout?.trim();
    } catch (error) {
        console.error(`exec error: ${error}`);
    }

    return version;
}