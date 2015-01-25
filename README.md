# cordova-simulator

Web application for simulating cordova plugins.

The app is a substitute for `cordova serve` (`ionic serve` for ionic users).

## Installing

```bash
$ npm install -g cordova-simulator
```

*Note: For a global install of `-g cordova-simulator`, OSX/Linux users may need to prefix the command with `sudo`.*

## Usage

```bash
$ cordova-simulator [-l] [-p num | --port=num] [folder]
```

Options:

| Param         | Description         | Default Value  |
| ------------- | ------------------- | -------------- |
| -p, --port    | The server's port   | 80             |
| -l            | Launch in browser   | false          |
| folder        | App folder          | 'www/'         |
| -h, --help    | Show help           | &nbsp;         |
| -v, --version | Show version number | &nbsp;         |

## Custom behavior

#### # platform classes

Based on the platform, the simulator will add `'platform-*'` classes to the body of the device.

#### # live reload

The simulator will reload the devices whenever a file is changed in the app folder.

*Note: This feature uses the **[`fs.watch`](http://nodejs.org/docs/latest/api/fs.html#fs_fs_watch_filename_options_listener)** method of node that is currently unstable.*

## Supported plugins

- [Device](https://github.com/apache/cordova-plugin-device) *