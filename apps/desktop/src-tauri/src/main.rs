
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_autostart::MacosLauncher;
use tauri::Manager;
fn main() {
    tauri_plugin_deep_link::prepare("com.wclsolution.docpal");
    
  tauri::Builder::default()
    .plugin(tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, Some(vec!["--flag1", "--flag2"]) /* arbitrary number of args to pass to your app */))
    .setup(|app|  {
        let handle = app.handle();
            println!("Setup start");
          tauri_plugin_deep_link::register(
            "docpal",
            move |request| {
              dbg!(&request);
              println!("{}", &request);
              handle.emit_all("scheme-request-received", request).unwrap();
            },
          ).unwrap(/* If listening to the scheme is optional for your app, you don't want to unwrap here. */);
          
          #[cfg(not(target_os = "macos"))] // on macos the plugin handles this (macos doesn't use cli args for the url)
            if let Some(url) = std::env::args().nth(1) {
              app.emit_all("scheme-request-received", url).unwrap();
            }
        Ok({})
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
