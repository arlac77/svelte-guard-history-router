

let server_path;
let desiredCapabilities;


server_path = "/usr/bin/safaridriver";
desiredCapabilities = {
    "browserName": "safari"
  };

server_path = 'node_modules/.bin/chromedriver';
desiredCapabilities = {
    browserName: 'chrome',
    chromeOptions: {
        args: [
        //    '--headless',
            '--no-sandbox',
            '--disable-gpu'
        ]
    }
};

module.exports = {
    src_folders: [
        'tests'
    ],

    output_folder: 'result',

    webdriver: {
        start_process: true,
        server_path,
        port: 9515
    },

    test_runner: {
        type: 'mocha',
        options: {
            ui: 'bdd',
            reporter: 'list'
        }
    },

    test_settings: {
        default: {
            desiredCapabilities
        }
    }
};