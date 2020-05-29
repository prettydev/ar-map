import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageLayout from "../../common/components/page-layout";
import Add from "./add";
import { fetchBuilding } from "../../utils/api";
import { useQuery } from "../../utils/index";

const BuildingAdd = (props: any) => {
  return (
    <PageLayout title="Add building">
      <Add {...props} />
    </PageLayout>
  );
};

export default BuildingAdd;
