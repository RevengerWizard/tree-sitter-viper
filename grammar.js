module.exports = grammar({
  name: "viper",

  rules: {
    source_file: ($) => repeat($.item),

    item: ($) =>
      choice(
        $.import_statement,
        $.alias_declaration,
        $.type_declaration,
        $.definition,
        $.variable_declaration,
        $.function_declaration,
        $.struct_declaration,
        $.union_declaration,
        $.enum_declaration,
        $.comment,
      ),

    import_statement: ($) =>
      seq(
        "from",
        field("path", $.string),
        "import",
        choice("*", seq($.identifier, optional(seq("as", $.identifier)))),
      ),

    alias_declaration: ($) => seq("alias", $.identifier, "=", $.base_type, ";"),

    type_declaration: ($) => seq("type", $.identifier, "=", $.base_type, ";"),

    definition: ($) =>
      seq(
        "def",
        $.identifier,
        optional(seq(":", $.base_type)),
        "=",
        $.expression,
        ";",
      ),

    variable_declaration: ($) =>
      seq(
        field("kind", choice("var", "let")),
        $.identifier,
        optional(seq(":", $.base_type)),
        optional(seq("=", $.expression)),
        ";",
      ),

    let_declaration: ($) => seq("let", $.identifier),

    struct_declaration: ($) =>
      seq("struct", $.identifier, "{", repeat($.parameter), "}"),

    union_declaration: ($) =>
      seq("union", $.identifier, "{", repeat($.parameter), "}"),

    enum_declaration: ($) =>
      seq("enum", $.identifier, "{", repeat($.identifier), "}"),

    function_declaration: ($) =>
      seq(
        optional(choice("pub", "inline", "noreturn")),
        "fn",
        $.identifier,
        $.parameters,
        ":",
        $.base_type,
        $.block,
      ),

    parameters: ($) =>
      seq("(", optional(seq($.parameter, repeat(seq(",", $.parameter)))), ")"),

    parameter: ($) => seq($.identifier, ":", $.base_type),

    block: ($) => seq("{", repeat($.statement), "}"),

    statement: ($) =>
      choice(
        $.if_statement,
        $.while_statement,
        $.for_statement,
        $.return_statement,
        $.break_statement,
        $.continue_statement,
        $.variable_declaration,
        $.asm_statement,
        $.expression_statement,
        $.block,
        ";",
      ),

    asm_statement: ($) => seq("asm", $.block),

    break_statement: ($) => seq("break", ";"),

    continue_statement: ($) => seq("continue", ";"),

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

    expression_statement: ($) => seq($.expression, ";"),

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

    user_type: ($) => seq(optional("const"), $.identifier),

    pointer_type: ($) => prec(1, seq($.base_type, "*", optional("?"))),

    base_type: ($) =>
      choice($.primitive_type, $.user_type, $.array_type, $.function_type),

    array_type: ($) =>
      prec(2, seq($.base_type, "[", optional($.expression), "]")),

    function_type: ($) =>
      prec(
        1,
        seq(
          "fn",
          optional("?"),
          "(",
          optional(seq($.type_or_param, repeat(seq(",", $.type_or_param)))),
          ")",
          ":",
          $.base_type,
        ),
      ),

    type_or_param: ($) =>
      choice($.base_type, seq($.identifier, ":", $.base_type)),

    parameter: ($) => seq($.identifier, ":", $.base_type),

    expression: ($) => $.ternary_expr,

    ternary_expr: ($) =>
      seq(
        $.logical_or_expr,
        optional(seq("?", $.expression, ":", $.expression)),
      ),

    logical_or_expr: ($) =>
      seq($.logical_and_expr, repeat(seq("or", $.logical_and_expr))),

    logical_and_expr: ($) =>
      seq($.equality_expr, repeat(seq("and", $.equality_expr))),

    equality_expr: ($) =>
      seq(
        $.relational_expr,
        repeat(seq(choice("==", "!="), $.relational_expr)),
      ),

    relational_expr: ($) =>
      seq(
        $.shift_expr,
        repeat(seq(choice("<", ">", "<=", ">="), $.shift_expr)),
      ),

    shift_expr: ($) =>
      seq($.additive_expr, repeat(seq(choice("<<", ">>"), $.additive_expr))),

    additive_expr: ($) =>
      seq(
        $.multiplicative_expr,
        repeat(seq(choice("+", "-"), $.multiplicative_expr)),
      ),

    multiplicative_expr: ($) =>
      seq($.unary_expr, repeat(seq(choice("*", "/", "%"), $.unary_expr))),

    unary_expr: ($) =>
      choice(
        $.postfix_expr,
        seq(
          choice("!", "not", "-", "+", "~", "&", "*", "++", "--"),
          $.unary_expr,
        ),
      ),

    postfix_expr: ($) =>
      seq(
        $.primary_expr,
        repeat(
          choice(
            seq("[", $.expression, "]"),
            seq(".", $.identifier),
            seq(
              "(",
              optional(seq($.expression, repeat(seq(",", $.expression)))),
              ")",
            ),
            choice("++", "--"),
          ),
        ),
      ),

    primary_expr: ($) =>
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
        seq("cast", "(", $.base_type, ",", $.expression, ")"),
        seq("intcast", "(", $.base_type, ",", $.expression, ")"),
        seq("floatcast", "(", $.base_type, ",", $.expression, ")"),
        seq("ptrcast", "(", $.base_type, ",", $.expression, ")"),
        seq("bitcast", "(", $.base_type, ",", $.expression, ")"),
        seq("typeof", "(", $.expression, ")"),
        seq("sizeof", "(", $.base_type, ")"),
        seq("alignof", "(", $.base_type, ")"),
        seq("offsetof", "(", $.base_type, ")"),
      ),

    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,
    number: ($) => /0x[0-9a-fA-F_]+|0b[01_]+|[0-9][0-9_]*/,
    float: ($) => /[0-9][0-9_]*\.[0-9_]+([eE][+-]?[0-9_]+)?/,
    character: ($) => /'([^'\\]|\\.?)'/,
    string: ($) => /"([^"\\]|\\.)*"/,
    comment: ($) => token(choice(seq("//", /.*/), seq("/*", /[\s\S]*?/, "*/"))),
  },
});
