import { useEffect, useState } from "react";
import { capitalCase } from "change-case";

import { Table, Tag } from "antd";
function makeTextColumn(field, data) {
  return {
    title: capitalCase(field),
    dataIndex: field,
    key: field,
    sorter: (a, b) => a[field].localeCompare(b[field]),
    filterSearch: true,
    onFilter: (value, record) => record[field] === value,
    filters: data.providers
      .filter((provider) => provider[field])
      .map((provider) => ({
        text: provider[field],
        value: provider[field],
      })),
  };
}
function makeTagsColumn(field, filterOptions) {
  return {
    title: capitalCase(field),
    dataIndex: field,
    render: (values) => {
      return (values ?? []).filter(Boolean).map((value) => <Tag>{value}</Tag>);
    },
    key: field,
    filterSearch: true,
    onFilter: (value, record) => record[field].includes(value),
    filters: filterOptions.filter(Boolean).map((value) => ({
      text: value,
      value,
    })),
  };
}
const makeColumns = (data) =>
  !data?.providers
    ? []
    : [
        makeTextColumn("Name", data),
        makeTextColumn("Company", data),
        makeTextColumn("Email", data),
        makeTextColumn("Phone", data),
        makeTagsColumn("Categories", data.categories),
        makeTagsColumn("serviceAreas", data.serviceAreas),
      ];
function MainTable({ height, width }) {
  const [data, setData] = useState();
  const [tableHeight, setTableHeight] = useState(0);
  useEffect(() => {
    const headerHeight = Number(
      document.querySelector("thead")?.clientHeight ?? 0
    );
    setTableHeight(height - headerHeight);
  }, [height, width]);
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch data from the Netlify function
        const response = await fetch("/.netlify/functions/data");
        const _data = await response.json();
        setData(_data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);
  return (
    <Table
      tableLayout="auto"
      dataSource={data ? data?.providers : []}
      columns={makeColumns(data)}
      size="small"
      // virtual
      loading={!data}
      pagination={false}
      scroll={{
        x: width,
        y: tableHeight -20,
      }}
    />
  );
}

export default MainTable;
