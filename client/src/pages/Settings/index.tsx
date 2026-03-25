import { Container } from "@mui/material";
import SettingsMenu from "../../components/SettingsMenu";

const Settings = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <SettingsMenu />
    </Container>
  );
};

export default Settings;
