// Generated from packages/schema/src/constants.ts. Do not edit; run the Octonode SDK sync.
export const PLUGIN_SCHEMA_VERSION = "1" as const;
export const PROJECT_JOB_PROTOCOL = "octonode.project-job.v1";
export const COMMUNITY_MEDIA_IMAGE_BYTES = 8 * 1024 * 1024;
export const COMMUNITY_MEDIA_VIDEO_BYTES = 20 * 1024 * 1024;
export const COMMUNITY_MEDIA_BODY_BYTES = Math.ceil(COMMUNITY_MEDIA_VIDEO_BYTES / 3) * 4 + 4096;
export const COMMUNITY_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
] as const;
export const PLUGIN_MANIFEST_FILENAME = "octonode.plugin.json";
export const PLUGIN_DEFINITION_FILENAMES = [
  "octonode.yml",
  "octonode.yaml",
  "octonode.json",
  PLUGIN_MANIFEST_FILENAME,
] as const;
export const MARKETPLACE_SCOPES = ["user", "group", "org", "public"] as const;

export const SETTINGS_API_VERSION = "octonode.dev/settings/v1" as const;
export const SETTINGS_SECTIONS = ["appearance", "overrides", "layers", "views", "discovery"] as const;

export const WORKSPACE_ACTIONS = [
  "projects:read",
  "projects:write",
  "workflows:run",
  "data:read",
  "data:write",
  "tables:manage",
  "members:invite",
  "members:manage",
  "teams:manage",
  "plugins:publish",
  "plugins:install",
  "org:settings",
  "social:read",
  "social:write",
  "social:moderate",
  "tasks:read",
  "tasks:write",
  "tasks:manage",
  "reviews:write",
  "github:connect",
  "github:publish",
  "agents:manage",
  "billing:read",
  "billing:manage",
  "integrations:read",
  "integrations:manage",
  "design:read",
  "design:review",
  "previews:read",
  "previews:manage",
  "terminal:use",
  "workflow-agents:run",
  "workflow-agents:manage",
  "agent-operations:read",
  "agent-operations:manage",
  "data:export",
  "data:restore",
  "workspace:delete",
  "content:read",
  "content:write",
  "content:publish",
  "content:moderate",
] as const;

export type WorkspaceAction = (typeof WORKSPACE_ACTIONS)[number];

export const AGENT_RUN_STATUSES = [
  "queued",
  "running",
  "approval_required",
  "completed",
  "cancelled",
  "failed",
] as const;

export const AGENT_ERROR_CODES = [
  "provider_not_configured",
  "service_unavailable",
  "provider_rate_limited",
  "provider_unavailable",
  "timeout",
  "cancelled",
  "invalid_model_response",
  "invalid_tool_call",
  "tool_failed",
  "step_limit",
  "token_limit",
  "permission_denied",
  "approval_denied",
  "conflict",
  "internal_error",
] as const;

export const AGENT_TOOL_RISKS = ["read", "write", "high"] as const;

export const COLLABORATION_ACTIONS = [
  "social:read",
  "social:write",
  "social:moderate",
  "tasks:read",
  "tasks:write",
  "tasks:manage",
  "reviews:write",
  "design:read",
  "design:review",
  "github:connect",
  "github:publish",
  "agents:manage",
  "data:export",
  "data:restore",
  "workspace:delete",
  "content:read",
  "content:write",
  "content:publish",
  "content:moderate",
] as const satisfies readonly WorkspaceAction[];

export const TASK_SPACE_TEMPLATES = ["simple", "kanban", "scrum"] as const;
export const TASK_STATUS_CATEGORIES = ["todo", "in_progress", "done"] as const;
export const WORK_ITEM_LEVELS = ["initiative", "epic", "standard", "subtask"] as const;
export const BUILTIN_WORK_ITEM_TYPES = ["initiative", "epic", "story", "task", "bug", "subtask"] as const;
export const WORK_ITEM_PRIORITIES = ["highest", "high", "medium", "low", "lowest"] as const;
export const TASK_FIELD_TYPES = [
  "text",
  "number",
  "single_select",
  "multi_select",
  "date",
  "checkbox",
  "user",
  "url",
] as const;
export const TASK_VIEW_LAYOUTS = ["board", "list", "calendar", "timeline"] as const;
export const TASK_VIEW_GROUPS = [
  "status",
  "assignee",
  "priority",
  "type",
  "tag",
  "sprint",
  "release",
  "custom_single_select",
  "none",
] as const;
export const TASK_VIEW_SORTS = ["rank", "updated", "due", "priority"] as const;
export const TASK_LINK_TYPES = ["blocks", "duplicates", "relates"] as const;
export const TASK_SPRINT_STATES = ["future", "active", "completed"] as const;
export const TASK_RELEASE_STATES = ["unreleased", "released", "archived"] as const;

export const SOURCE_CONTROL_REGION_KINDS = [
  "if",
  "switch",
  "for",
  "while",
  "do-while",
  "for-in",
  "for-of",
  "break",
  "continue",
  "label",
  "try",
  "catch",
  "finally",
] as const;

export const PLATFORM_CAPABILITIES = [
  "workspace_identity",
  "workspace_social",
  "task_management",
  "workspace_admin",
  "workflow_execution",
  "billing",
  "design_review",
  "design_preview",
  "architecture",
  "repository_registry",
  "repository_discovery",
  "repository_git_read",
  "repository_git_write",
  "design_architecture_embed",
  "workspace_registry_backup_restore",
  "github",
  "slack",
  "google",
  "meta",
  "qwen",
  "workflow_agents",
  "cloud_terminal",
  "mcp_catalog",
  "monitoring",
  "agent_monitoring",
  "backup_restore",
  "write_authority",
  "community_read",
  "community_authoring",
  "community_publishing",
  "workflow_templates",
] as const;

export const CAPABILITY_MODES = ["trusted-local", "configured-local-cloud", "hosted"] as const;

export const CAPABILITY_UNAVAILABLE_REASONS = [
  "not_implemented",
  "requires_cloud_configuration",
  "requires_hosted_runtime",
  "provider_not_configured",
  "disabled_by_policy",
  "missing_entitlement",
  "missing_permission",
] as const;

export const PLUGIN_RELEASE_FILES = ["plugin.octonode.json", "plugin.octonode.yml", "plugin.octonode.yaml"] as const;
export const PLUGIN_PUBLISH_AUDIENCE = "https://plugins.octonodes.com";
export const PLUGIN_CONFIG_MAX_BYTES = 65_536;
export const PLUGIN_PUBLISH_MAX_BYTES = 32 * 1024 * 1024;
