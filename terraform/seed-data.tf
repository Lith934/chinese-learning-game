# Sample Chinese characters data
resource "aws_dynamodb_table_item" "character_ni" {
  table_name = aws_dynamodb_table.characters.name
  hash_key   = aws_dynamodb_table.characters.hash_key

  item = jsonencode({
    id = {
      S = "1"
    }
    character = {
      S = "你"
    }
    pinyin = {
      S = "nǐ"
    }
    meaning = {
      S = "you"
    }
    difficulty = {
      N = "1"
    }
    category = {
      S = "pronouns"
    }
  })
}

resource "aws_dynamodb_table_item" "character_hao" {
  table_name = aws_dynamodb_table.characters.name
  hash_key   = aws_dynamodb_table.characters.hash_key

  item = jsonencode({
    id = {
      S = "2"
    }
    character = {
      S = "好"
    }
    pinyin = {
      S = "hǎo"
    }
    meaning = {
      S = "good/well"
    }
    difficulty = {
      N = "1"
    }
    category = {
      S = "adjectives"
    }
  })
}

resource "aws_dynamodb_table_item" "character_wo" {
  table_name = aws_dynamodb_table.characters.name
  hash_key   = aws_dynamodb_table.characters.hash_key

  item = jsonencode({
    id = {
      S = "3"
    }
    character = {
      S = "我"
    }
    pinyin = {
      S = "wǒ"
    }
    meaning = {
      S = "I/me"
    }
    difficulty = {
      N = "1"
    }
    category = {
      S = "pronouns"
    }
  })
}

resource "aws_dynamodb_table_item" "character_shi" {
  table_name = aws_dynamodb_table.characters.name
  hash_key   = aws_dynamodb_table.characters.hash_key

  item = jsonencode({
    id = {
      S = "4"
    }
    character = {
      S = "是"
    }
    pinyin = {
      S = "shì"
    }
    meaning = {
      S = "to be/am/is/are"
    }
    difficulty = {
      N = "1"
    }
    category = {
      S = "verbs"
    }
  })
}

resource "aws_dynamodb_table_item" "character_de" {
  table_name = aws_dynamodb_table.characters.name
  hash_key   = aws_dynamodb_table.characters.hash_key

  item = jsonencode({
    id = {
      S = "5"
    }
    character = {
      S = "的"
    }
    pinyin = {
      S = "de"
    }
    meaning = {
      S = "possessive particle"
    }
    difficulty = {
      N = "2"
    }
    category = {
      S = "particles"
    }
  })
}