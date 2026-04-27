import { useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { FilterList, Search } from "@mui/icons-material";
import type { Card, Member, Tag } from "../types/kanban";
import type { DueDateFilter, Filters } from "../utils/filters";
import { activeFilterCount, defaultFilters } from "../utils/filters";
import { stringAvatar } from "../utils/avatar";

interface FilterMenuProps {
  filters: Filters;
  onChange: (next: Filters) => void;
  members: Member[];
  cards: Card[];
}

const FilterMenu = ({ filters, onChange, members, cards }: FilterMenuProps) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const count = activeFilterCount(filters);

  // unique tags across all cards on the board, dedupe by label (first color wins)
  const uniqueTags = useMemo(() => {
    const map = new Map<string, Tag>();
    for (const card of cards) {
      for (const tag of card.tags) {
        if (!map.has(tag.label)) map.set(tag.label, tag);
      }
    }
    return Array.from(map.values());
  }, [cards]);

  const toggleAssignee = (memberId: string) => {
    const next = filters.assigneeIds.includes(memberId)
      ? filters.assigneeIds.filter((id) => id !== memberId)
      : [...filters.assigneeIds, memberId];
    onChange({ ...filters, assigneeIds: next });
  };

  const toggleTag = (label: string) => {
    const next = filters.tagLabels.includes(label)
      ? filters.tagLabels.filter((l) => l !== label)
      : [...filters.tagLabels, label];
    onChange({ ...filters, tagLabels: next });
  };

  return (
    <Box>
      <Tooltip
        title={
          count > 0
            ? "Filter cards — drag-and-drop disabled while filtering"
            : "Filter cards"
        }
        arrow
      >
        <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
          <Badge
            badgeContent={count}
            color="primary"
            invisible={count === 0}
          >
            <FilterList fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2, minWidth: 320 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1.5 }}>
            Filters
          </Typography>

          {/* Keyword search */}
          <TextField
            value={filters.keyword}
            onChange={(e) => onChange({ ...filters, keyword: e.target.value })}
            placeholder="Search cards…"
            size="small"
            fullWidth
            autoFocus
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Divider sx={{ my: 2 }} />

          {/* Assignee */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.5 }}
          >
            Assignee
          </Typography>
          <List dense disablePadding>
            {members.map((member) => {
              const checked = filters.assigneeIds.includes(member._id);
              return (
                <ListItemButton
                  key={member._id}
                  onClick={() => toggleAssignee(member._id)}
                  dense
                  sx={{ borderRadius: 1, py: 0.25 }}
                >
                  <Checkbox
                    checked={checked}
                    edge="start"
                    size="small"
                    disableRipple
                    sx={{ p: 0.5, mr: 1 }}
                  />
                  <Avatar
                    {...stringAvatar(member.username, {
                      width: 24,
                      height: 24,
                      fontSize: 12,
                      mr: 1,
                    })}
                  />
                  <ListItemText primary={member.username} />
                </ListItemButton>
              );
            })}
          </List>

          {/* Tags */}
          {uniqueTags.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 1 }}
              >
                Tags
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                {uniqueTags.map((tag) => {
                  const checked = filters.tagLabels.includes(tag.label);
                  return (
                    <Chip
                      key={tag.label}
                      label={tag.label}
                      size="small"
                      onClick={() => toggleTag(tag.label)}
                      variant={checked ? "filled" : "outlined"}
                      sx={{
                        bgcolor: checked ? tag.color : "transparent",
                        borderColor: tag.color,
                      }}
                    />
                  );
                })}
              </Box>
            </>
          )}

          {/* Due date */}
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            Due date
          </Typography>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={filters.dueDate}
            onChange={(_, value) =>
              onChange({
                ...filters,
                dueDate: value as DueDateFilter | null,
              })
            }
            sx={{ flexWrap: "wrap" }}
          >
            <ToggleButton value="overdue">Overdue</ToggleButton>
            <ToggleButton value="thisWeek">This week</ToggleButton>
            <ToggleButton value="none">No due date</ToggleButton>
          </ToggleButtonGroup>

          {/* Footer */}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              size="small"
              disabled={count === 0}
              onClick={() => onChange(defaultFilters)}
            >
              Clear all
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default FilterMenu;
