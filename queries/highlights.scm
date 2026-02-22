;; Keywords - Control flow
["if" "else" "while" "for" "break" "continue" "return" "switch" "case" "default"] @keyword

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

;; Fn declarations
(fn_declaration (identifier) @function)

;; Var declarations
(var_declaration
  name: (identifier) @variable)
(var_declaration ":" @punctuation.delimiter)
(var_declaration init_type: (_) @type)

;; Let declarations
(let_declaration
  name: (identifier) @variable)
(let_declaration ":" @punctuation.delimiter)
(let_declaration init_type: (_) @type)

;; Def declarations
(def_declaration
  name: (identifier) @constant)
(def_declaration ":" @punctuation.delimiter)
(def_declaration init_type: (_) @type)

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
(scoped_identifier path: (_) @type)
(scoped_identifier member: (identifier) @variable.member)
(scoped_identifier "::" @punctuation.delimiter)

;; Parameters
(parameter
  name: (identifier) @variable.parameter)

;; Function types
(function_type) @type

;; Pointer types
(pointer_type) @type

;; Array types
(array_type (base_type) @type)
(array_type "[" @punctuation.bracket "]" @punctuation.bracket)

;; Struct initializers
(struct_initializer) @constructor
(struct_element) @property

(user_type "const" @keyword)
(user_type (identifier) @type)

;; Function Calls
(postfix_expr
  (primary_expr (identifier) @function.call)
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