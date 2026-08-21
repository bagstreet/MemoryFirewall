import Workbench from "./workbench";

// Rendered per request so the CSP nonce from middleware.ts is stamped onto
// Next's inline bootstrap scripts; a prerendered shell would be script-blocked.
export const dynamic = "force-dynamic";

export default function Page() {
  return <Workbench />;
}
