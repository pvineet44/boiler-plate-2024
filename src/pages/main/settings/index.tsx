import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ThemedForm } from "@/pages";
import TablePageComponent from "@/components/ui/TablePageComponent";
// @ts-ignore
import { Settings } from "@prisma/client";
import validator from "@rjsf/validator-ajv8";
import { toast } from "react-toastify";
import { SquarePen, Trash2 } from "lucide-react";
import useSWR, { mutate } from "swr";
import pageSize from "@/config/pageSize";
import { fetcher } from "@/util/swr";
import AddSettingForm from "@/components/settings/AddSettingForm";
import axios from "axios";


const SettingsPage = () => {
  const [settings, setSettings] = useState<Settings[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Settings[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editSetting, setEditSetting] = useState<Partial<Settings>>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | number | null>(
    null
  );

  const { data, error, isLoading } = useSWR<{
    settings: Settings[];
    totalPages: number;
  }>(`/api/settings?page=${currentPage}&pageSize=${pageSize}`, fetcher);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Field Type",
      dataIndex: "fieldType",
      key: "fieldType",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: Settings) => (
        <span>
          <button
            onClick={() => openEditModal(record)}
            className="text-black py-1 rounded-md"
          >
            <SquarePen />
          </button>
          <button
            onClick={() => openDeleteModal(record.id)}
            className="text-black py-1 rounded-md"
          >
            <Trash2 />
          </button>
        </span>
      ),
    },
  ];

  useEffect(() => {
    if (data) {
      setSettings(data?.settings);
      setTotalPages(data?.totalPages);
    }
  }, [data]);

  const displayedData =
    searchInput || searchResults.length > 0
      ? searchResults.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )
      : settings;

  const openEditModal = (setting: Settings) => {
    setEditSetting(setting);
    setIsEditing(true);
  };
  const closeEditModal = () => {
    setIsEditing(false);
  };

  const openDeleteModal = (id: number) => {
    setDeleteItemId(id);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteItemId(null);
    setIsDeleteDialogOpen(false);
  };

  const handleUpdate = async (id: number | string) => {
    try {
      const updateData = {
        id: id,
        data: editSetting,
      };
      if(!editSetting.id || !editSetting.name || !editSetting.value || !editSetting.fieldType){
        return
      }
      await axios
        .put("/api/settings", updateData)
        .then((res) => {
          toast("Setting updated successfully!", { type: "success" });
          mutate(`/api/settings?page=${currentPage}&pageSize=${pageSize}`);
        })
        .catch((err) => {
          toast("Something went wrong!", { type: "error" });
        });

      mutate(`/api/user?top_level=1&page=${currentPage}&pageSize=${pageSize}`);
      closeEditModal();
    } catch (error) {
      toast.error("Error adding colour. Colour name might be already added.");
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await fetch(`/api/settings/delete/${id}`, {
        method: "DELETE",
      });

      mutate(`/api/settings?page=${currentPage}&pageSize=${pageSize}`);
      toast.success("Deleted!");
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      closeDeleteModal();
    }
  };

  const fetchSettingsForPage = async (page: number) => {
    setCurrentPage(page);
    mutate(`/api/settings?page=${currentPage}&pageSize=${pageSize}`);
  };

  const onSubmit = async (values: Partial<Settings>) => {
    await axios
      .post("/api/settings", { ...values })
      .then((res) => {
        toast("Setting added successfully!", { type: "success" });
        mutate(`/api/settings?page=${currentPage}&pageSize=${pageSize}`);
      })
      .catch((err) => {
        toast("Something went wrong!", { type: "error" });
      });
  };

  return (
    <>
      {error && <div>Error loading settings</div>}
      {!data && isLoading && <div>Loading settings...</div>}
      <div>
        <h2 className="text-3xl font-bold mb-4">Settings Page</h2>
      </div>

      {/* // TODO: fix auth */}
      <TablePageComponent
        currentPage={currentPage}
        totalPages={totalPages}
        fetchItems={fetchSettingsForPage}
        columns={columns}
        data={displayedData}
        />

      <Dialog open={isEditing} onOpenChange={closeEditModal}>
        <DialogContent
          style={{ maxHeight: "calc(100vh - 4rem)", overflowY: "auto" }}
        >
          <DialogHeader>
            <DialogTitle>Edit Setting Data</DialogTitle>
          </DialogHeader>
          <ThemedForm
            schema={{
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "Name",
                },
                value: {
                  type: "string",
                  title: "Value",
                },
                fieldType: {
                  type: "string",
                  title: "Field Type",
                },
              },
              required: ["name", "value", "fieldType"],
            }}
            uiSchema={{
              name: {
                "ui:placeholder": "Name",
                "ui:widget": "InputWidget",
              },
              value: {
                "ui:placeholder": "Value",
                "ui:widget": "InputWidget",
              },
              fieldType: {
                "ui:placeholder": "Field Type",
                "ui:widget": "InputWidget",
              },
            }}
            formData={editSetting}
            validator={validator}
            onChange={({ formData }) => {
              setEditSetting(formData);
            }}
          >
            <div className="flex space-x-2">
              <button
                onClick={() => editSetting.id && handleUpdate(editSetting.id)}
                className="bg-black text-white px-4 py-2 rounded cursor-pointer hover:bg-white mt-4 border-2 border-black hover:text-black"
                type="submit"
              >
                Update
              </button>
              <button
                onClick={() => {
                  closeEditModal();
                  setIsEditing(false);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded cursor-pointer mt-4 border-2"
              >
                Cancel
              </button>
            </div>
          </ThemedForm>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={closeDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this item?</p>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => deleteItemId && handleDelete(deleteItemId)}
              className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-white hover:text-red-500 border-2 border-red-500"
            >
              Delete
            </button>
            <button
              onClick={closeDeleteModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded cursor-pointer border-2"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-4 rounded-md border bg-white">
        <div>
          <h2 className="text-xl font-bold p-2">Add Setting Form</h2>
        </div>
        <AddSettingForm onSubmit={onSubmit} />
      </div>
    </>
  );
};

export default SettingsPage;

