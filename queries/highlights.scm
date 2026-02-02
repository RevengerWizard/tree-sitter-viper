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