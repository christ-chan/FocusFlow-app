{ pkgs, ... }: {
  # Specifies the Nixpkgs channel. This determines which package versions are
  # available to your workspace.
  channel = "stable-24.05"; # Or "unstable"

  # A list of Nix packages to make available in your workspace.
  packages = [
    pkgs.nodejs_20
    # Add the Firebase CLI for authentication and other Firebase services.
    pkgs.firebase-tools
  ];

  # A set of environment variables to be defined in your workspace.
  env = {};

  # VS Code extensions to install in your workspace.
  idx = {
    extensions = [
      "google.gemini-cli-vscode-ide-companion"
      "dbaeumer.vscode-eslint"
    ];

    # Workspace lifecycle hooks.
    workspace = {
      # Runs when a workspace is first created.
      onCreate = {
        npm-install = "npm install";
      };
      # Runs every time the workspace is (re)started.
      onStart = {
        dev = "npm run dev";
      };
    };

    # Web app preview configuration.
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev"];
          manager = "web";
        };
      };
    };
  };
}
