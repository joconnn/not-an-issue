// Card that shows the workspace
// Links to that workspace id

import { Link } from "react-router";

interface Props {
  name: string;
  id: string;
}

export function WorkspaceCard({ name, id }: Props) {
  return (
    <div>
      <h2>{name}</h2>
      <Link to={`/workspaces/${id}`}>workspace</Link>
    </div>
  );
}
