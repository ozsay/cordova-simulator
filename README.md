# cordova-simulator

Web application for simulating cordova plugins.

The app is an alternative for `cordova serve` (`ionic serve` for ionic users).

## Installing

```bash
$ npm install -g cordova-simulator
```

*Note: For a global install of `-g cordova-simulator`, OSX/Linux users may need to prefix the command with `sudo`.*

## Usage

```bash
$ cordova-simulator [-l | --launch] [-d | --demo] [-p num | --port=num] [-a app1[,app2...] | --apps=app1[,app2...]] [-r resource_folder1[,resource_folder2...] | --resources=resource_folder1[,resource_folder2...]]
```

Options:

| Param           | Description            | Default Value  |
| --------------- | ---------------------- | -------------- |
| -p, --port      | The server's port      | 80             |
| -l, --launch    | Launch in browser      | false          |
| -d, --demo      | Include the demo       | false          |
| -a, --apps      | Apps folders           | ['www/']       |
| -r, --resources | Resources folders      | []             |
| -h, --help      | Show help              | &nbsp;         |
| -v, --version   | Show version number    | &nbsp;         |

## Custom behavior

#### # platform classes

Based on the platform, the simulator will add `'platform-*'` classes to the body of the device.

#### # live reload

The simulator will reload the devices whenever a file is changed in the app folder.

*Note: This feature uses the **[`fs.watch`](http://nodejs.org/docs/latest/api/fs.html#fs_fs_watch_filename_options_listener)** method of node that is currently unstable.*

## Supported plugins

- [App Version](https://github.com/whiteoctober/cordova-plugin-app-version)
- [Clipboard](https://github.com/VersoSolutions/CordovaClipboard)
- [Device](https://github.com/apache/cordova-plugin-device) *
- [Flashlight](https://github.com/EddyVerbruggen/Flashlight-PhoneGap-Plugin)
- [Vibration](https://github.com/apache/cordova-plugin-vibration) *

`* official Apache Cordova Plugin`