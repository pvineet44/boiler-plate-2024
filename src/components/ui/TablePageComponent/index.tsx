import React from "react";
import { Table, Pagination, ConfigProvider } from "antd";

interface TablePageComponentProps {
  currentPage: number;
  totalPages: number;
  fetchItems: (page: number) => void;
  columns: any[]; // Ant Design table columns
  data: any[]; // Array of data
}

const TablePageComponent: React.FC<TablePageComponentProps> = ({
  currentPage,
  totalPages,
  fetchItems,
  columns,
  data,
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "rgba(0, 0, 0, 0.88)",
          colorPrimaryHover: "rgba(0, 0, 0, 0.70)",
        },
      }}
    >
      <div>
        <Table
          dataSource={data}
          columns={columns}
          pagination={false} // Ant Design Pagination will be added separately
          scroll={{ x: true }}
        />

        <Pagination
          current={currentPage}
          total={totalPages * 10} // Assuming each page contains 10 items
          pageSize={10}
          onChange={fetchItems}
          className="mt-4 "
        />
      </div>
    </ConfigProvider>
  );
};

export default TablePageComponent;
