import { exec } from "child_process";
import { promisify } from "util";

/**
 * Module to stage all current changes except the crowdin-config.yml file and
 * commit them to a designated branch name.
 *
 * @param {string} username The GitHub username to commit from.
 * @param {string} email The GitHub email to commit from.
 * @param {string} branchName The name of the branch to commit to.
 * @param {string} commitMessage The commit message to use.
 * @param {string} submodule Optional, the submodule to commit changes to.
 */
export const commitChanges = async (
  username: string,
  email: string,
  branchName: string,
  commitMessage: string,
  submodule?: string
) => {
  const asyncExec = promisify(exec);
  const options = submodule ? { cwd: submodule } : {};

  await asyncExec(`git config --global user.name ${username}`);
  await asyncExec(`git config --global user.email ${email}`);
  await asyncExec(`git checkout -b ${branchName}`, options);
  await asyncExec("git add .", options);
  await asyncExec("git reset crowdin-config.yml", options);
  await asyncExec(`git commit -m "${commitMessage}"`, options);
  await asyncExec(`git push -u origin ${branchName} -f`, options);
};
