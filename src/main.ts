import * as core from '@actions/core'
// import * as github from '@actions/github'
// import * as checkout from 'actions/checkout@v2'
import * as exec from '@actions/exec'
import * as io from '@actions/io'
// import * as upload from 'actions/upload-artifact@v2'
// import {Octokit} from '@octokit/rest'
import * as inputHelper from 'npm-demo-shin/lib/input-helper'
import * as gitSourceProvider from 'npm-demo-shin/lib/git-source-provider'

async function execLog(command: string): Promise<void> {
  const stdout: string[] = []
  const stderr: string[] = []

  const options: any = {
    listeners: {
      stdout: (data: Buffer) => {
        stdout.push(data.toString())
      },
      stderr: (data: Buffer) => {
        stderr.push(data.toString())
      }
    }
  }
  core.startGroup(`execute command ${command}`)
  await exec.exec(command, [], options)

  core.debug(stdout.join(''))
  core.debug(stderr.join(''))
  core.endGroup()
}

async function run(): Promise<void> {
  try {
    // 0. checkout 当前仓库
    const sourceSettings = inputHelper.getInputs()
    try {
      await gitSourceProvider.getSource(sourceSettings)
    } catch (error) {
      core.setFailed(error.message)
    }

    const lsPath = await io.which('ls', true)
    await execLog(lsPath)

    // const authToken = ''
    // // 通过链接解析
    // const repo = ''
    // const owner = ''
    // const octokit = new github.GitHub(authToken)
    // const params: Octokit.ReposGetArchiveLinkParams = {
    //   owner: owner,
    //   repo: repo,
    //   archive_format: IS_WINDOWS ? 'zipball' : 'tarball',
    //   // ref: commit || ref
    // }
    // const response = await octokit.repos.get(params)
    // const result = response.data.default_branch
    // const gitPath = await io.which('git', true)
    // await exec.exec(`"${gitPath}"`, ['checkout'], {})

    // 1. 拉取壳子工程
    // const shellCustomSettings = {
    //   repository: sourceSettings.shellRepository,
    //   repositoryPath: sourceSettings.shellRepositoryPath,
    //   ref: sourceSettings.shellRef
    // }
    const shellCustomSettings = {
      repository: '4332weizi/taro-native-shell',
      repositoryPath: 'taro-native-shell',
      ref: '0.63.2_origin'
    }
    const shellSettings = inputHelper.getInputs(shellCustomSettings)
    core.debug(JSON.stringify(shellSettings))
    try {
      await gitSourceProvider.getSource(shellSettings)
    } catch (error) {
      core.setFailed(error.message)
    }

    await execLog(lsPath)

    // 2. merge package.json
    // 3. install node modules
    // 4. taro build rn
    // 5. 把 build 的结果存在一个地方 actions/upload-artifact@v2
    // 6. 软链 node_modules to Shell Project => ln -s $PWD/node_modules $PWD/taro-native-shell/node_modules
    // 7. 移动 bundle 文件到壳子制定目录
    // 8. 集成 app，发布
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
