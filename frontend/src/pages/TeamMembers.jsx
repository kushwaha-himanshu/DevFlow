import { users } from "../mock/users";
import { PageHeader, Avatar } from "../components/common";

export function TeamMembers() {
  return (
    <>
      <PageHeader eyebrow="People" title="Your team" />
      <div className="grid projects-grid">
        {users.map((u) => (
          <div className="panel" key={u.id} style={{ textAlign: "center" }}>
            <Avatar id={u.id} size="large" />
            <h3>{u.name}</h3>
            <p style={{ fontSize: 12, color: "#788296" }}>{u.email}</p>
            <span className="badge priority-LOW">{u.role}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default TeamMembers;
