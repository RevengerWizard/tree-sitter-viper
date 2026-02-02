fn main() {
    let parser_dir = std::path::PathBuf::from("src");
    cc::Build::new()
        .include(&parser_dir)
        .file(parser_dir.join("parser.c"))
        .compile("tree-sitter-viper");

    println!("cargo:rerun-if-changed=src/parser.c");
}