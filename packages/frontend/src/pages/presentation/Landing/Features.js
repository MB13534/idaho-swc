import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { NavLink } from "react-router-dom";

import { Box, Button, Container, Grid, Typography } from "@material-ui/core";

import { spacing } from "@material-ui/system";

import {
  BookOpen as BookOpenIcon,
  Code as CodeIcon,
  Database as DatabaseIcon,
  Layout as LayoutIcon,
  PlusCircle as PlusCircleIcon,
  Users as UsersIcon,
} from "react-feather";
import { ROUTES } from "../../../constants";
import { useAuth0 } from "@auth0/auth0-react";
import { opacify } from "polished";
import { customSecondary } from "../../../theme/variants";

const Wrapper = styled.div`
  ${spacing};
  background: ${(props) => props.theme.palette.background.paper};
  text-align: center;
`;

const AppBarBg = styled.div`
  top: 0;
  right: 0;
  left: auto;
  margin-top: -64px;
  position: sticky;
  width: 100%;
  height: 64px;
  background: ${(props) => opacify(-0.1, props.theme.palette.background.paper)};
`;
const TypographyOverline = styled(Typography)`
  text-transform: uppercase;
  color: ${(props) => props.theme.palette.primary.main};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
`;

const FeatureWrapper = styled.div`
  display: flex;
  text-align: left;
  padding: 18px 20px;
`;

const FeatureIcon = styled.div`
  svg {
    flex-shrink: 0;
    width: auto;
    height: 32px;
    width: 32px;
    color: ${() => customSecondary[500]};
  }
`;

const Feature = ({ Icon, title, description }) => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={4}>
      <FeatureWrapper>
        <FeatureIcon>
          <Icon />
        </FeatureIcon>
        <Box ml={6}>
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {description}
          </Typography>
        </Box>
      </FeatureWrapper>
    </Grid>
  );
};

function Features() {
  const { user, isLoading } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      setIsAdmin(
        user[`${process.env.REACT_APP_AUDIENCE}/roles`].includes(
          "Administrator"
        )
      );
    }
  }, [user]);

  if (isLoading) return <React.Fragment />;

  return (
    <Wrapper py={20}>
      <AppBarBg />
      <Container>
        <TypographyOverline variant="body2" gutterBottom>
          Features
        </TypographyOverline>
        <Typography variant="h2" component="h3" gutterBottom>
          Why Use LRE Water Unified Platform
        </Typography>
        <Box mb={8} />
        <Grid container spacing={6}>
          <Feature
            Icon={CodeIcon}
            title="Built for Developers"
            description="LRE Water Unified Platform is built to make your life easier. Authentication, modeling, theming, build tooling, documentation, and hundreds of components. "
          />
          <Feature
            Icon={PlusCircleIcon}
            title="Multiple Plugins"
            description="Various third-party plugins are fully integrated, like Chart.js, Redux, WYSIWYG Editors, Formik and Yup."
          />
          <Feature
            Icon={DatabaseIcon}
            title="CRUD Factory"
            description="You can easily create stunning and friendly interfaces to create, read, update, and delete database records."
          />
          <Feature
            Icon={UsersIcon}
            title="Authentication Examples"
            description="The package comes with fully working authentication examples, using Redux, Axios and Auth0. Roles and permissions included."
          />
          <Feature
            Icon={BookOpenIcon}
            title="Detailed Documentation"
            description="We've written extensive documentation for the plugins and tools we're using, varying from Redux to ESLint."
          />
          <Feature
            Icon={LayoutIcon}
            title="Material UI"
            description="LRE Water Unified Platform uses Material UI, ensuring an adaptable system of components and tools that support the best practices of user interface design."
          />
        </Grid>

        {isAdmin && (
          <Box mt={4}>
            <Button
              component={NavLink}
              to={ROUTES.PAGE_DOCUMENTATION}
              variant="contained"
              color="primary"
              size="large"
            >
              Open Documentation
            </Button>
          </Box>
        )}
      </Container>
    </Wrapper>
  );
}

export default Features;
