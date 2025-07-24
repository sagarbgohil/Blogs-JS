#!/bin/bash

# Check if module name is provided
if [ -z "$1" ]; then
  echo "❌ Please provide a module name. Usage: ./create-module.sh moduleName"
  exit 1
fi

# Normalize the module name (lowercase)
MODULE_NAME=$(echo "$1" | tr '[:upper:]' '[:lower:]')
MODULE_DIR="src/modules/$MODULE_NAME"

# Create module directory if it doesn't exist
if [ ! -d "$MODULE_DIR" ]; then
  echo "📁 Creating directory: $MODULE_DIR"
  mkdir -p "$MODULE_DIR"
else
  echo "📁 Directory already exists: $MODULE_DIR"
fi

# File list
FILES=(
  "$MODULE_NAME.routes.js"
  "$MODULE_NAME.controller.js"
  "$MODULE_NAME.model.js"
  "$MODULE_NAME.schema.js"
  "$MODULE_NAME.service.js"
  "$MODULE_NAME.validation.js"
)

# Create each file if it doesn't exist
for FILE in "${FILES[@]}"; do
  FILE_PATH="$MODULE_DIR/$FILE"
  if [ ! -f "$FILE_PATH" ]; then
    touch "$FILE_PATH"
    echo "📝 Created: $FILE_PATH"
  else
    echo "✅ Already exists: $FILE_PATH"
  fi
done

echo "🎉 Module '$MODULE_NAME' setup complete!"
