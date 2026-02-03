#include "tree_sitter/parser.h"
#include <wctype.h>

enum TokenType { COMMENT };

void *tree_sitter_viper_external_scanner_create() { return NULL; }
void tree_sitter_viper_external_scanner_destroy(void *payload) {}
unsigned tree_sitter_viper_external_scanner_serialize(void *payload, char *buffer) { return 0; }
void tree_sitter_viper_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {}

bool tree_sitter_viper_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
  if (!valid_symbols[COMMENT]) return false;

  while (iswspace(lexer->lookahead)) lexer->advance(lexer, true);

  if (lexer->lookahead == '/') {
    lexer->advance(lexer, false);

    // Line comment: //
    if (lexer->lookahead == '/') {
      while (lexer->lookahead != '\n' && !lexer->eof(lexer)) lexer->advance(lexer, false);
      lexer->result_symbol = COMMENT;
      return true;
    }

    // Block comment: /* (Nested)
    if (lexer->lookahead == '*') {
      lexer->advance(lexer, false);
      int depth = 1;
      while (depth > 0 && !lexer->eof(lexer)) {
        if (lexer->lookahead == '/') {
          lexer->advance(lexer, false);
          if (lexer->lookahead == '*') {
            depth++;
            lexer->advance(lexer, false);
          }
        } else if (lexer->lookahead == '*') {
          lexer->advance(lexer, false);
          if (lexer->lookahead == '/') {
            depth--;
            lexer->advance(lexer, false);
          }
        } else {
          lexer->advance(lexer, false);
        }
      }
      lexer->result_symbol = COMMENT;
      return true;
    }
  }
  return false;
}