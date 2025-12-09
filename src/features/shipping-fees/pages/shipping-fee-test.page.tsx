import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { ShippingFeeForm } from "../components/shipping-fee-form.component";
import { useShippingFeeCrud, useShippingFeeModalCrud } from "../hooks";
import type { ShippingFee } from "../types";

/**
 * Test page for shipping fee CRUD operations
 * This demonstrates the fixed mutations and proper error/success handling
 */
const ShippingFeeTestPage: React.FC = () => {
  // Sample data for testing edit/delete
  const sampleShippingFee: ShippingFee = {
    id: "test-id",
    shippingType: "Giao hàng nhanh",
    area: "Hà Nội",
    estimatedDeliveryTime: "1-2 ngày",
    shippingFee: 50000,
    notesOrRemarks: "Test data",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const createCrud = useShippingFeeCrud();
  const editCrud = useShippingFeeCrud(sampleShippingFee);
  const {
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeAllModals,
    handleDeleteSuccess,
  } = useShippingFeeModalCrud();

  const handleCreateSuccess = () => {
    closeAllModals();
  };

  const handleEditSuccess = () => {
    closeAllModals();
  };

  const handleDeleteConfirm = async () => {
    await editCrud.deleteShippingFee(handleDeleteSuccess);
  };

  const handleOpenEdit = () => {
    openEditModal(sampleShippingFee);
  };

  const handleOpenDelete = () => {
    openDeleteModal(sampleShippingFee);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shipping Fee CRUD Test Page
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        This page tests the fixed shipping fee mutations with proper response
        handling. Check the toast notifications and console for detailed
        feedback.
      </Typography>

      {/* Status Alerts */}
      <Box sx={{ mb: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        {createCrud.isCreateSuccess && (
          <Alert severity="success">
            Create operation completed successfully!
          </Alert>
        )}
        {editCrud.isUpdateSuccess && (
          <Alert severity="success">
            Update operation completed successfully!
          </Alert>
        )}
        {editCrud.isDeleteSuccess && (
          <Alert severity="success">
            Delete operation completed successfully!
          </Alert>
        )}
      </Box>

      {/* Test Buttons */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Test Operations
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openCreateModal}
            disabled={createCrud.isLoading}
          >
            Test Create
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Edit />}
            onClick={handleOpenEdit}
            disabled={editCrud.isLoading}
          >
            Test Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={handleOpenDelete}
            disabled={editCrud.isLoading}
          >
            Test Delete
          </Button>
        </Box>
      </Paper>

      {/* Current Form State Display */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Form State Debug
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Create Form:
        </Typography>
        <pre
          style={{
            fontSize: "12px",
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          {JSON.stringify(
            {
              formData: createCrud.formData,
              errors: createCrud.errors,
              isValid: createCrud.isValid,
              isLoading: createCrud.isLoading,
            },
            null,
            2
          )}
        </pre>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          Edit Form:
        </Typography>
        <pre
          style={{
            fontSize: "12px",
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          {JSON.stringify(
            {
              formData: editCrud.formData,
              errors: editCrud.errors,
              isValid: editCrud.isValid,
              isLoading: editCrud.isLoading,
            },
            null,
            2
          )}
        </pre>
      </Paper>

      {/* Create Modal */}
      <Dialog
        open={isCreateModalOpen}
        onClose={closeAllModals}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Test Create Shipping Fee</DialogTitle>
        <DialogContent>
          <ShippingFeeForm
            mode="create"
            onSubmit={async () => {
              await createCrud.submitForm(handleCreateSuccess);
            }}
            onCancel={closeAllModals}
            loading={createCrud.isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={closeAllModals}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Test Edit Shipping Fee</DialogTitle>
        <DialogContent>
          <ShippingFeeForm
            mode="edit"
            initialData={sampleShippingFee}
            onSubmit={async () => {
              await editCrud.submitForm(handleEditSuccess);
            }}
            onCancel={closeAllModals}
            loading={editCrud.isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onClose={closeAllModals}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete shipping fee for{" "}
            <strong>{sampleShippingFee.shippingType}</strong> in{" "}
            <strong>{sampleShippingFee.area}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAllModals}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={editCrud.isDeleting}
          >
            {editCrud.isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ShippingFeeTestPage;
