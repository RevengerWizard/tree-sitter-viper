;; Keywords - Control flow
["if" "else" "do" "while" "for" "break" "continue" "return" "switch" "case" "default"] @keyword

;; Keywords - Declarations
["fn" "var" "let" "def" "alias" "struct" "union" "enum" "type"] @keyword

;; Keywords - Modifiers
["pub" "inline" "noreturn" "extern" "export" "asm" "import" "from" "as"] @keyword

;; Keywords - Operators
["and" "or" "not"] @keyword

;; Keywords - Type operations
["cast" "intcast" "floatcast" "ptrcast" "bitcast" "typeof" "sizeof" "alignof" "offsetof"] @keyword

;; Primitive types
["void" "bool" "int8" "int16" "int32" "int64" "uint8" "uint16" "uint32" "uint64" "isize" "usize" "float32" "float64"] @type.builtin

;; Boolean and nil literals
["true" "false" "nil"] @constant.builtin

;; Comments
(comment) @comment

;; String and character literals
(string) @string
(character) @character

;; Numbers
(number) @number
(float) @number
(suffixed_number suffix: (number_type_suffix) @type.builtin)

;; Enums
(enum_declaration name: (identifier) @type)
(enum_declaration base_type: (_) @type)
(enum_variant name: (identifier) @constant)

;; Switch
(switch_statement
  "switch" @keyword
  condition: (_)
  (case_arm
    "case" @keyword
    value: (_)))

(default_arm
  "default" @keyword)

;; Ensure blocks inside switch arms are highlighted
(case_arm (short_block (block) @none))
(default_arm (short_block (block) @none))

;; Packed modifier
(struct_declaration "packed" @keyword)
(union_declaration "packed" @keyword)
(struct_type "packed" @keyword)
(union_type "packed" @keyword)
(opaque_struct_pointer_type "packed" @keyword)
(opaque_union_pointer_type "packed" @keyword)

;; Fn declarations
(fn_declaration (identifier) @function)

;; Var declarations
(var_declaration
  name: (identifier) @variable)
(var_declaration ":" @punctuation.delimiter)

;; Let declarations
(let_declaration
  name: (identifier) @variable)
(let_declaration ":" @punctuation.delimiter)

;; Def declarations
(def_declaration
  name: (identifier) @constant)
(def_declaration ":" @punctuation.delimiter)

;; Type declarations
(struct_declaration
  name: (identifier) @type)

(union_declaration
  name: (identifier) @type)

(enum_declaration
  name: (identifier) @type)

(alias_declaration
  name: (identifier) @type)

(type_declaration
  name: (identifier) @type)

;; Imports
(import_alias name: (identifier) @variable)
(import_alias alias: (identifier) @variable)

;; Scoped access
(scoped_identifier path: (identifier) @type)
(scoped_identifier path: (primitive_type) @type.builtin)
(scoped_identifier member: (identifier) @variable.member)
(scoped_identifier "::" @punctuation.delimiter)

(field_suffix member: (identifier) @variable.member)

;; Parameters
(parameter
  name: (identifier) @variable.parameter)

;; Function types
(function_type "fn" @keyword)

;; Aggregate types
(opaque_struct_pointer_type) @type
(opaque_union_pointer_type) @type
(struct_field name: (identifier) @variable.member)
(enum_type base_type: (_) @type)

;; Pointer types

;; Array types
(array_type "[" @punctuation.bracket "]" @punctuation.bracket)

;; Struct initializers
(struct_initializer) @constructor
(struct_element) @property

(user_type "const" @keyword)
(user_type (identifier) @type)
(qualified_type (identifier) @type)
(qualified_type "::" @punctuation.delimiter)

;; Function Calls
(postfix_expr
  (primary_expr (identifier) @function.call)
  (arguments))

(postfix_expr
  (primary_expr
    (scoped_identifier
      member: (identifier) @function.call
      .))
  (arguments))

;; Operators
["=" "+=" "-=" "*=" "/=" "%=" "&=" "|=" "^=" "<<=" ">>="] @operator
["+" "-" "*" "/" "%"] @operator
["&" "|" "^" "~" "<<" ">>"] @operator
["==" "!=" "<" ">" "<=" ">="] @operator
["!" "++" "--"] @operator
["." "?"] @operator

;; Punctuation
["(" ")" "[" "]" "{" "}"] @punctuation.bracket
[";" "," ":" "::"] @punctuation.delimiter
