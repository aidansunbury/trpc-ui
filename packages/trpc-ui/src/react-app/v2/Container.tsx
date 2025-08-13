import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CollapsableSection } from "@src/react-app/components/CollapsableSection";
import React from "react";

import { Form } from "./Form";

import type { Procedure, Router } from "@src/parseV2/types";

export function Container({
  item,
  isRoot = false,
}: { item: Router | Procedure; isRoot?: boolean }) {
  const renderTitle = (path: string[]) => {
    const name = path.at(-1);
    return (
      <Typography
        component="span"
        sx={{
          fontWeight: 600,
          fontSize: "1rem",
          letterSpacing: "0.01em",
        }}
      >
        {name}
      </Typography>
    );
  };

  // Use minimal spacing between items
  const spacing = isRoot ? 0.75 : 0.5;

  if (item.type === "router") {
    return (
      <Box sx={{ mb: spacing }}>
        <CollapsableSection
          fullPath={item.path}
          titleElement={renderTitle(item.path)}
          sectionType={"router"}
          isRoot={isRoot}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              px: 1,
              py: 0.75,
              borderLeft: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            {Object.entries(item.children).map(([key, routerOrProcedure]) => (
              <Container item={routerOrProcedure} key={key} isRoot={false} />
            ))}
          </Box>
        </CollapsableSection>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: spacing }}>
      <CollapsableSection
        fullPath={item.path}
        sectionType={item.type}
        isRoot={isRoot}
        titleElement={renderTitle(item.path)}
      >
        <Box sx={{ p: 0 }}>
          <Form procedure={item} />
        </Box>
      </CollapsableSection>
    </Box>
  );
}
