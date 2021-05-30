import { Card, CardContent, Typography } from "@material-ui/core";

export const InfoBox = ({ title, cases, total }) => {
  return (
    <Card className="infoBox">
      <CardContent>
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        <Typography className="infoBox__cases">{cases} K</Typography>
        <Typography className="infoBox__deaths" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
};
