module.exports = grammar({
  name: "viper",

  extras: ($) => [
    $.comment,
    /\s/, // Ensure whitespace is handled here too
  ],

  externals: ($) => [$.comment],

  rules: {
    source_file: ($) => repeat($.item),

    item: ($) =>
      choice(
        $.import_declaration,
        $.alias_declaration,
        $.type_declaration,
        $.def_declaration,
        $.var_declaration,
        $.let_declaration,
        $.fn_declaration,
        $.struct_declaration,
        $.union_declaration,
        $.enum_declaration,
      ),

    import_declaration: ($) =>
      choice(
        seq("import", field("path", $.path_identifier)),
        seq(
          "from",
          field("path", $.path_identifier),
          "import",
          choice("*", seq($.import_alias, repeat(seq(",", $.import_alias)))),
        ),
      ),

    import_alias: ($) =>
      seq(
        field("name", $.identifier),
        optional(seq("as", field("alias", $.identifier))),
      ),

    path_identifier: ($) =>
      prec.left(seq($.identifier, repeat(seq("::", $.identifier)))),

    alias_declaration: ($) =>
      seq("alias", field("name", $.identifier), "=", $.base_type, ";"),

    type_declaration: ($) =>
      seq("type", field("name", $.identifier), "=", $.base_type, ";"),

    def_declaration: ($) =>
      seq(
        "def",
        field("name", $.identifier),
        optional(field("init_type", seq(":", $.base_type))),
        "=",
        $.expression,
        ";",
      ),

    var_declaration: ($) =>
      seq(
        "var",
        field("name", $.identifier),
        optional(field("init_type", seq(":", $.base_type))),
        optional(seq("=", $.expression)),
        ";",
      ),

    let_declaration: ($) =>
      seq(
        "let",
        field("name", $.identifier),
        optional(field("init_type", seq(":", $.base_type))),
        optional(seq("=", $.expression)),
        ";",
      ),

    struct_declaration: ($) =>
      seq(
        optional("packed"),
        "struct",
        field("name", $.identifier),
        choice(";", seq("{", repeat($.struct_field), "}")),
      ),

    union_declaration: ($) =>
      seq(
        "union",
        field("name", $.identifier),
        "{",
        repeat($.struct_field),
        "}",
      ),

    struct_field: ($) =>
      seq(
        choice(
          seq(
            field("name", $.identifier),
            repeat(seq(",", field("name", $.identifier))),
            ":",
            choice($.base_type, $.pointer_type),
          ),
          $.anonymous_aggregate,
        ),
        ";",
      ),

    anonymous_aggregate: ($) =>
      seq(
        optional("packed"),
        choice("struct", "union"),
        "{",
        repeat($.struct_field),
        "}",
      ),

    enum_declaration: ($) =>
      seq(
        "enum",
        field("name", $.identifier),
        optional(seq(":", field("base_type", $.base_type))),
        "{",
        optional(
          seq($.enum_variant, repeat(seq(",", $.enum_variant)), optional(",")),
        ),
        "}",
      ),

    enum_variant: ($) =>
      seq(field("name", $.identifier), optional(seq("=", $.expression))),

    fn_declaration: ($) =>
      seq(
        repeat(choice("pub", "inline", "noreturn", "extern", "export")),
        "fn",
        field("name", $.identifier),
        $.parameters,
        ":",
        choice($.base_type, $.pointer_type),
        choice(";", $.block),
      ),

    parameters: ($) =>
      seq("(", optional(seq($.parameter, repeat(seq(",", $.parameter)))), ")"),

    parameter: ($) => seq($.identifier, ":", $.base_type),

    block: ($) => seq("{", repeat($.statement), "}"),

    statement: ($) =>
      choice(
        $.if_statement,
        $.switch_statement,
        $.while_statement,
        $.for_statement,
        $.return_statement,
        $.break_statement,
        $.continue_statement,
        $.var_declaration,
        $.let_declaration,
        $.assignment_statement,
        $.asm_statement,
        $.expression_statement,
        $.block,
        ";",
      ),

    short_block: ($) =>
      choice(
        $.block,
        $.return_statement,
        $.continue_statement,
        $.break_statement,
      ),

    switch_statement: ($) =>
      seq(
        "switch",
        field("condition", $.expression),
        repeat1(choice($.case_arm, $.default_arm)),
      ),

    case_arm: ($) => seq("case", field("value", $.expression), $.short_block),

    default_arm: ($) => seq("default", $.short_block),

    asm_statement: ($) => seq("asm", $.short_block),

    break_statement: ($) => seq("break", ";"),

    continue_statement: ($) => seq("continue", ";"),

    assignment_statement: ($) =>
      seq(
        $.postfix_expr,
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
        ";",
      ),

    if_statement: ($) =>
      seq(
        "if",
        $.expression,
        $.short_block,
        optional(seq("else", choice($.short_block, $.if_statement))),
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

    user_type: ($) => seq(optional("const"), choice($.identifier, $.qualified_type)),

    qualified_type: ($) =>
      prec.left(seq($.identifier, repeat1(seq("::", $.identifier)))),

    pointer_type: ($) =>
      seq(
        choice($.primitive_type, $.user_type, $.array_type, $.function_type),
        "*",
        optional("?"),
      ),

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
      choice(
        $.base_type,
        $.pointer_type,
        seq($.identifier, ":", $.base_type),
        seq($.identifier, ":", $.pointer_type),
      ),

    parameter: ($) =>
      seq(
        field("name", $.identifier),
        ":",
        choice($.base_type, $.pointer_type),
      ),

    expression: ($) => $.ternary_expr,

    ternary_expr: ($) =>
      seq(
        $.logical_or_expr,
        optional(seq("?", $.expression, ":", $.expression)),
      ),

    logical_or_expr: ($) =>
      prec.left(
        1,
        seq($.logical_and_expr, repeat(seq("or", $.logical_and_expr))),
      ), // PREC_OR

    logical_and_expr: ($) =>
      prec.left(2, seq($.equality_expr, repeat(seq("and", $.equality_expr)))), // PREC_AND

    equality_expr: ($) =>
      prec.left(
        3,
        seq(
          $.relational_expr,
          repeat(seq(choice("==", "!="), $.relational_expr)),
        ),
      ), // PREC_EQUALITY

    relational_expr: ($) =>
      prec.left(
        4,
        seq(
          $.bitwise_or_expr,
          repeat(seq(choice("<", ">", "<=", ">="), $.bitwise_or_expr)),
        ),
      ), // PREC_COMPARISON

    bitwise_or_expr: ($) =>
      prec.left(
        5,
        seq($.bitwise_xor_expr, repeat(seq("|", $.bitwise_xor_expr))),
      ), // PREC_BOR

    bitwise_xor_expr: ($) =>
      prec.left(
        6,
        seq($.bitwise_and_expr, repeat(seq("^", $.bitwise_and_expr))),
      ), // PREC_BXOR

    bitwise_and_expr: ($) =>
      prec.left(7, seq($.shift_expr, repeat(seq("&", $.shift_expr)))), // PREC_BAND

    shift_expr: ($) =>
      prec.left(
        8,
        seq($.additive_expr, repeat(seq(choice("<<", ">>"), $.additive_expr))),
      ), // PREC_SHIFT

    additive_expr: ($) =>
      prec.left(
        9,
        seq(
          $.multiplicative_expr,
          repeat(seq(choice("+", "-"), $.multiplicative_expr)),
        ),
      ), // PREC_TERM

    multiplicative_expr: ($) =>
      prec.left(
        10,
        seq($.unary_expr, repeat(seq(choice("*", "/", "%"), $.unary_expr))),
      ), // PREC_FACTOR

    unary_expr: ($) =>
      choice(
        $.postfix_expr,
        seq(
          choice("!", "not", "-", "+", "~", "&", "*", "++", "--"),
          $.unary_expr,
        ),
      ),

    postfix_expr: ($) =>
      prec.left(
        11,
        seq(
          $.primary_expr,
          repeat(
            choice(
              seq("[", $.expression, "]"),
              seq(".", $.identifier),
              $.arguments,
              choice("++", "--"),
            ),
          ),
        ),
      ),

    arguments: ($) =>
      seq(
        "(",
        optional(seq($.expression, repeat(seq(",", $.expression)))),
        ")",
      ),

    primary_expr: ($) =>
      choice(
        $.scoped_identifier,
        $.identifier,
        $.number,
        $.float,
        $.character,
        $.string,
        "true",
        "false",
        "nil",
        seq("(", $.expression, ")"),
        $.struct_initializer,
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

    scoped_identifier: ($) =>
      prec(
        12,
        seq(
          // High precedence to bind :: tighter than operators
          field("path", choice($.identifier, $.primitive_type)),
          repeat1(seq("::", field("member", $.identifier))),
          optional(seq("::", $.struct_initializer)),
        ),
      ),

    struct_initializer: ($) =>
      seq(
        "{",
        seq(
          $.struct_element,
          repeat(seq(",", $.struct_element)),
          optional(","),
        ),
        "}",
      ),

    struct_element: ($) =>
      prec(
        2,
        choice(
          seq("[", $.expression, "]", "=", $.expression),
          seq($.identifier, "=", $.expression),
        ),
      ),

    identifier: ($) => token(seq(/[a-zA-Z_]/, repeat(/[a-zA-Z0-9_]*/))),
    number: ($) => /0x[0-9a-fA-F_]+|0b[01_]+|[0-9][0-9_]*/,
    float: ($) => /[0-9][0-9_]*\.[0-9_]+([eE][+-]?[0-9_]+)?/,
    character: ($) => /'([^'\\]|\\.?)'/,
    string: ($) => /"([^"\\]|\\.)*"/,

    // Inside rules
    comment: ($) =>
      token(
        choice(
          seq("//", /.*/),
          seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"), // Improved regex for non-nested block comments
        ),
      ),
  },
});
