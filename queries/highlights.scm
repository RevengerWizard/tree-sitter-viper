;; Keywords - Control flow
["if" "else" "while" "for" "break" "continue" "return"] @keyword

;; Keywords - Declarations
["fn" "var" "let" "def" "alias" "struct" "union" "enum" "type"] @keyword

;; Keywords - Modifiers
["pub" "inline" "noreturn" "extern" "export" "asm" "import" "from"] @keyword

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
[";" "," ":"] @punctuation.delimiter