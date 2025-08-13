import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ProcedureMeta } from "@src/parseV2/types";
import { JSONSchema7, JSONSchema7Object } from "json-schema";
import React from "react";
import Markdown from "react-markdown";

interface DocumentationSectionProps {
  meta?: ProcedureMeta;
  schema?: JSONSchema7Object;
}

type PropertyInfo = {
  path: string;
  required: boolean;
  type: string | undefined;
  description: string | undefined;
};

export function DocumentationSection({
  meta,
  schema,
}: DocumentationSectionProps) {
  if (!meta && (!schema || !hasSchemaDescriptions(schema))) {
    return null;
  }

  // Extract all property descriptions including nested ones
  const propertyDescriptions = schema
    ? extractPropertyDescriptions(schema)
    : [];
  const hasPropertyDescriptions = propertyDescriptions.length > 0;

  return (
    <Paper elevation={1} sx={{ mb: 2, overflow: "hidden" }}>
      {/* Meta documentation */}
      {meta && Object.keys(meta).length > 0 && (
        <Box sx={{ p: 1.5 }}>
          <Stack spacing={2.5}>
            {Object.entries(meta).map(([key, value]) => (
              <Box key={key}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    color: "text.primary",
                    fontSize: "1.125rem",
                    letterSpacing: "0.01em",
                  }}
                >
                  {key}
                </Typography>
                <Box
                  sx={{
                    "& .markdown": {
                      lineHeight: 1.5,
                      fontSize: "0.875rem",
                      "& a": { color: "primary.main" },
                      "& code": {
                        bgcolor: "rgba(0, 0, 0, 0.04)",
                        p: 0.25,
                        borderRadius: 0.5,
                        fontFamily: "monospace",
                      },
                    },
                  }}
                >
                  <Markdown className="markdown">{value}</Markdown>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Schema property descriptions */}
      {hasPropertyDescriptions && (
        <>
          {meta && Object.keys(meta).length > 0 && <Divider />}
          <Box sx={{ p: 1.5 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                mb: 1.5,
                fontWeight: 600,
                color: "text.primary",
                fontSize: "1.125rem",
                letterSpacing: "0.01em",
              }}
            >
              Params
            </Typography>

            {propertyDescriptions.map((prop) => (
              <Box
                key={prop.path}
                sx={{
                  mb: 1.25,
                  "&:last-child": { mb: 0 },
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "30%",
                    maxWidth: "250px",
                    minWidth: "120px",
                    flexShrink: 0,
                    mr: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      fontFamily: "monospace",
                      color: "text.primary",
                      fontSize: "0.8rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {prop.path}
                    {prop.required && (
                      <Typography
                        component="span"
                        color="error.main"
                        sx={{ ml: 0.5, fontWeight: 700 }}
                      >
                        *
                      </Typography>
                    )}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    flexGrow: 1,
                  }}
                >
                  {prop.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mr: 1,
                        "& code": {
                          bgcolor: "rgba(0, 0, 0, 0.04)",
                          px: 0.5,
                          borderRadius: 0.5,
                          fontFamily: "monospace",
                        },
                        "& p": {
                          my: 0,
                        },
                      }}
                    >
                      <Markdown>{prop.description}</Markdown>
                    </Typography>
                  )}

                  {prop.type && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontStyle: "italic",
                        mt: 0.25,
                        flexShrink: 0,
                      }}
                    >
                      {prop.type.toString()}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
}

// Helper function to recursively extract all property descriptions
function extractPropertyDescriptions(
  schema: JSONSchema7Object,
  parentPath = "",
  parentIsRequired = true,
): PropertyInfo[] {
  if (!schema.properties) return [];

  const properties: PropertyInfo[] = [];

  for (const [propName, propSchema] of Object.entries(schema.properties)) {
    const propDetails = propSchema as JSONSchema7Object;
    const path = parentPath ? `${parentPath}.${propName}` : propName;

    // A property is only truly required if:
    // 1. It's in the required array of its parent schema AND
    // 2. All of its parent objects are also required
    const propIsRequired =
      parentIsRequired && (schema.required || []).includes(propName);

    // Add this property if it has a description
    if (propDetails.description) {
      properties.push({
        path,
        required: propIsRequired,
        type: propDetails.type?.toString(),
        description: propDetails.description,
      });
    }

    // Recursively add nested properties - the nested property inherits the required status
    // of its parent object (if parent object is optional, all children are optional)
    if (propDetails.properties) {
      properties.push(
        ...extractPropertyDescriptions(
          propDetails,
          path,
          propIsRequired, // Pass down if this object is required
        ),
      );
    }

    // Handle arrays with items that have nested properties
    if (propDetails.type === "array" && propDetails.items) {
      const items = propDetails.items as JSONSchema7Object;
      if (items.properties) {
        properties.push(
          ...extractPropertyDescriptions(
            items,
            `${path}[]`,
            propIsRequired, // Pass down if this array is required
          ),
        );
      }
    }
  }

  return properties;
}

// Helper function to check if schema has any property descriptions
function hasSchemaDescriptions(schema: JSONSchema7Object): boolean {
  // Check direct properties
  if (schema.properties) {
    const hasDirectDescriptions = Object.values(schema.properties).some(
      (prop) => {
        const propDetails = prop as JSONSchema7Object;
        return !!propDetails.description;
      },
    );

    if (hasDirectDescriptions) return true;

    // Check nested properties
    for (const propSchema of Object.values(schema.properties)) {
      const propDetails = propSchema as JSONSchema7Object;

      // Check object properties
      if (propDetails.properties && hasSchemaDescriptions(propDetails)) {
        return true;
      }

      // Check array items
      if (propDetails.type === "array" && propDetails.items) {
        const items = propDetails.items as JSONSchema7Object;
        if (items.properties && hasSchemaDescriptions(items)) {
          return true;
        }
      }
    }
  }

  return false;
}
