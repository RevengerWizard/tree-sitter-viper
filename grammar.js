module.exports = grammar({
  name: "viper",

  rules: {
    source_file: ($) =>
      repeat(
        choice(
          $.import_statement,
          $.function_declaration,
          $.variable_declaration,
          $.constant_declaration,
          $.alias_declaration,
          $.struct_declaration,
          $.union_declaration,
          $.enum_declaration,
          $.definition,
          $.inline_assembly,
          $.comment,
        ),
      ),

    // Import statements
    import_statement: ($) =>
      seq(
        "from",
        $.string,
        "import",
        choice("*", seq($.identifier, repeat(seq(",", $.identifier)))),
      ),

    // Comments
    comment: ($) => token(choice(seq("//", /.*/), seq("/*", /[\s\S]*?/, "*/"))),

    // Function declaration
    function_declaration: ($) =>
      seq(
        optional(choice("pub", "inline", "noreturn")),
        "fn",
        $.identifier,
        $.parameters,
        ":",
        $.type,
        $.block,
      ),

    // Parameters
    parameters: ($) =>
      seq("(", optional(seq($.parameter, repeat(seq(",", $.parameter)))), ")"),

    parameter: ($) => seq($.identifier, ":", $.type),

    // Variable declarations
    variable_declaration: ($) =>
      seq(
        "var",
        $.identifier,
        optional(seq(":", $.type)),
        optional(seq("=", $.expression)),
        ";",
      ),

    constant_declaration: ($) =>
      seq(
        "const",
        $.identifier,
        optional(seq(":", $.type)),
        optional(seq("=", $.expression)),
        ";",
      ),

    let_declaration: ($) =>
      seq(
        "let",
        $.identifier,
        optional(seq(":", $.type)),
        optional(seq("=", $.expression)),
      ),

    // Alias declaration
    alias_declaration: ($) => seq("alias", $.identifier, "=", $.type, ";"),

    // Definition (constants)
    definition: ($) =>
      seq(
        "def",
        $.identifier,
        optional(seq(":", $.type)),
        "=",
        $.expression,
        ";",
      ),

    // Struct declaration
    struct_declaration: ($) =>
      seq(
        "struct",
        $.identifier,
        "{",
        repeat(seq($.identifier, ":", $.type, ";")),
        "}",
      ),

    // Union declaration
    union_declaration: ($) =>
      seq(
        "union",
        $.identifier,
        "{",
        repeat(seq($.identifier, ":", $.type, ";")),
        "}",
      ),

    // Enum declaration
    enum_declaration: ($) =>
      seq(
        "enum",
        $.identifier,
        "{",
        repeat(seq($.identifier, optional(seq("=", $.number)), ",")),
        "}",
      ),

    // Inline assembly
    inline_assembly: ($) => seq("asm", $.string),

    // Block
    block: ($) => seq("{", repeat($.statement), "}"),

    // Statements
    statement: ($) =>
      choice(
        $.variable_declaration,
        $.constant_declaration,
        $.let_declaration,
        $.if_statement,
        $.while_statement,
        $.for_statement,
        $.return_statement,
        $.break_statement,
        $.continue_statement,
        $.expression_statement,
        $.block,
        $.comment,
      ),

    // Control flow
    if_statement: ($) =>
      seq(
        "if",
        $.expression,
        $.block,
        optional(seq("else", choice($.block, $.if_statement))),
      ),

    while_statement: ($) => seq("while", $.expression, $.block),

    for_statement: ($) => seq("for", $.identifier, "in", $.expression, $.block),

    return_statement: ($) => seq("return", optional($.expression), ";"),

    break_statement: ($) => ";",

    continue_statement: ($) => ";",

    expression_statement: ($) => seq($.expression, ";"),

    // Types
    type: ($) =>
      choice(
        $.primitive_type,
        $.pointer_type,
        $.array_type,
        $.function_type,
        $.named_type,
      ),

    primitive_type: ($) =>
      choice(
        "void",
        "bool",
        "int8",
        "int16",
        "int32",
        "int64",
        "uint8",
        "uint16",
        "uint32",
        "uint64",
        "isize",
        "usize",
        "float32",
        "float64",
      ),

    pointer_type: ($) => seq($.type, "*", optional("?")),

    array_type: ($) => seq($.type, "[", optional($.expression), "]"),

    function_type: ($) =>
      seq(
        "fn",
        "?",
        "(",
        optional(seq($.type, repeat(seq(",", $.type)))),
        ")",
        ":",
        $.type,
      ),

    named_type: ($) => choice($.identifier, seq("const", $.identifier, "*")),

    // Expressions
    expression: ($) => choice($.assignment_expression, $.ternary_expression),

    assignment_expression: ($) =>
      seq(
        $.ternary_expression,
        optional(
          seq(
            choice(
              "=",
              "+=",
              "-=",
              "*=",
              "/=",
              "%=",
              "&=",
              "|=",
              "^=",
              "<<=",
              ">>=",
            ),
            $.expression,
          ),
        ),
      ),

    ternary_expression: ($) =>
      seq(
        $.logical_or_expression,
        optional(seq("?", $.expression, ":", $.expression)),
      ),

    logical_or_expression: ($) =>
      seq(
        $.logical_and_expression,
        repeat(seq(choice("or", "||"), $.logical_and_expression)),
      ),

    logical_and_expression: ($) =>
      seq(
        $.bitwise_or_expression,
        repeat(seq(choice("and", "&&"), $.bitwise_or_expression)),
      ),

    bitwise_or_expression: ($) =>
      seq($.bitwise_xor_expression, repeat(seq("|", $.bitwise_xor_expression))),

    bitwise_xor_expression: ($) =>
      seq($.bitwise_and_expression, repeat(seq("^", $.bitwise_and_expression))),

    bitwise_and_expression: ($) =>
      seq($.equality_expression, repeat(seq("&", $.equality_expression))),

    equality_expression: ($) =>
      seq(
        $.relational_expression,
        repeat(seq(choice("==", "!=", "eq", "noteq"), $.relational_expression)),
      ),

    relational_expression: ($) =>
      seq(
        $.shift_expression,
        repeat(
          seq(choice("<", ">", "<=", ">=", "le", "ge"), $.shift_expression),
        ),
      ),

    shift_expression: ($) =>
      seq(
        $.additive_expression,
        repeat(
          seq(choice("<<", ">>", "lshift", "rshift"), $.additive_expression),
        ),
      ),

    additive_expression: ($) =>
      seq(
        $.multiplicative_expression,
        repeat(seq(choice("+", "-"), $.multiplicative_expression)),
      ),

    multiplicative_expression: ($) =>
      seq(
        $.unary_expression,
        repeat(seq(choice("*", "/", "%"), $.unary_expression)),
      ),

    unary_expression: ($) =>
      choice(
        $.postfix_expression,
        seq(choice("+", "-", "!", "not", "~", "&", "*"), $.unary_expression),
        seq(choice("++", "--"), $.postfix_expression),
      ),

    postfix_expression: ($) =>
      seq(
        $.primary_expression,
        repeat(
          choice(
            seq("[", $.expression, "]"),
            seq(".", $.identifier),
            seq("->", $.identifier),
            seq(
              "(",
              optional(seq($.expression, repeat(seq(",", $.expression)))),
              ")",
            ),
            choice("++", "--"),
          ),
        ),
      ),

    primary_expression: ($) =>
      choice(
        $.identifier,
        $.number,
        $.float,
        $.character,
        $.string,
        "true",
        "false",
        "nil",
        seq("(", $.expression, ")"),
        seq("typeof", "(", $.expression, ")"),
        seq("sizeof", "(", choice($.type, $.expression), ")"),
        seq("alignof", "(", $.type, ")"),
        seq("offsetof", "(", $.type, ",", $.identifier, ")"),
        seq("typeid", "(", $.type, ")"),
        seq("cast", "(", $.type, ",", $.expression, ")"),
        seq("intcast", "(", $.type, ",", $.expression, ")"),
        seq("floatcast", "(", $.type, ",", $.expression, ")"),
        seq("ptrcast", "(", $.type, ",", $.expression, ")"),
        seq("bitcast", "(", $.type, ",", $.expression, ")"),
        $.struct_literal,
        $.array_literal,
      ),

    struct_literal: ($) =>
      seq(
        $.identifier,
        "{",
        optional(
          seq(
            seq($.identifier, "=", $.expression),
            repeat(seq(",", $.identifier, "=", $.expression)),
          ),
        ),
        "}",
      ),

    array_literal: ($) =>
      seq(
        "[",
        optional(seq($.expression, repeat(seq(",", $.expression)))),
        "]",
      ),

    // Literals
    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,

    number: ($) =>
      choice(
        /0x[0-9a-fA-F_]+[ulUL]*/,
        /0b[01_]+[ulUL]*/,
        /[0-9][0-9_]*[ulUL]*/,
      ),

    float: ($) => /[0-9][0-9_]*\.[0-9_]*([eE][+-]?[0-9_]+)?[flFL]*/,

    character: ($) => /'([^'\\]|\\.?)'/,

    string: ($) => /"(\\.|[^"\\])*"/,
  },
});
