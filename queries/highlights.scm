;; Keywords - Control flow
["if" "else" "while" "for" "break" "continue" "return"] @keyword

;; Keywords - Declarations
["fn" "var" "let" "def" "alias" "struct" "union" "enum" "type"] @keyword

;; Keywords - Modifiers
["pub" "inline" "noreturn" "asm" "import" "from"] @keyword

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

;; Function declarations
(fn_declaration
  name: (identifier) @function)

;; Variable declarations
(var_declaration
  name: (identifier) @variable)

;; Let declarations
(let_declaration
  name: (identifier) @variable)

;; Def declarations
(def_declaration
  name: (identifier) @constant)

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
(array_type) @type

;; Operators
["=" "+=" "-=" "*=" "/=" "%=" "&=" "|=" "^=" "<<=" ">>="] @operator
["+" "-" "*" "/" "%"] @operator
["&" "|" "^" "~" "<<" ">>"] @operator
["==" "!=" "<" ">" "<=" ">="] @operator
["!" "++" "--"] @operator
["." "->" "?"] @operator

;; Punctuation
["(" ")" "[" "]" "{" "}"] @punctuation.bracket
[";" "," ":"] @punctuation.delimiter
;; Struct initializers
(struct_initializer) @constructor
(struct_element) @property