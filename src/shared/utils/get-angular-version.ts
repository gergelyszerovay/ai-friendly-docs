import { exec as execSync } from "child_process";
import { promisify } from "util";

const exec = promisify(execSync);

export const getAngularLatestVersion = async () => {
    let version = "19.2.3";
    
    const { stdout, stderr } = await exec("npm view @angular/core version");

    if (stderr) {
        throw new Error(`exec error: ${stderr}`);
    }

    version = stdout?.trim();

    return version;
}