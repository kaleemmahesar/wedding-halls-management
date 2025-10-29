import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Card, 
  Button, 
  Input, 
  Select, 
  Row, 
  Col, 
  Typography, 
  Space,
  Table,
  Empty,
  message,
  Form,
  Modal
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  SaveOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { addExpense, updateExpense, deleteExpense } from '../store/slices/expensesSlice';

const { Title, Text } = Typography;

// Predefined expense categories
const EXPENSE_CATEGORIES = [
  'Labour Cost',
  'Maintenance',
  'Decoration',
  'Groceries',
  'Other'
];

const ExpenseManagement = ({ bookingId, isAddingExpense, onToggleAddExpense }) => {
  const dispatch = useDispatch();
  const expenses = useSelector(state => 
    state.expenses.expenses.filter(expense => expense.bookingId === bookingId)
  );
  
  const [editingExpense, setEditingExpense] = useState(null);
  const [form] = Form.useForm();
  
  const [newExpense, setNewExpense] = useState({
    title: '',
    category: '',
    amount: '',
    isCustomCategory: false,
    customCategory: ''
  });

  const handleAddExpense = () => {
    onToggleAddExpense(true);
    setEditingExpense(null);
    setNewExpense({
      title: '',
      category: '',
      amount: '',
      isCustomCategory: false,
      customCategory: ''
    });
    form.resetFields();
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense.id);
    const isCustom = !EXPENSE_CATEGORIES.includes(expense.category);
    setNewExpense({
      title: expense.title,
      category: isCustom ? 'Other' : expense.category,
      amount: expense.amount,
      isCustomCategory: isCustom,
      customCategory: isCustom ? expense.category : ''
    });
    form.setFieldsValue({
      title: expense.title,
      category: isCustom ? 'Other' : expense.category,
      amount: expense.amount,
      customCategory: isCustom ? expense.category : ''
    });
  };

  const handleSaveExpense = () => {
    form.validateFields().then(values => {
      // Determine the category to use
      const category = values.isCustomCategory 
        ? values.customCategory 
        : values.category;
      
      const expenseData = {
        bookingId,
        title: values.title,
        category,
        amount: parseFloat(values.amount)
      };
      
      if (editingExpense) {
        // Update existing expense
        dispatch(updateExpense({ id: editingExpense, ...expenseData }))
          .then(() => {
            message.success('Expense updated successfully!');
            setEditingExpense(null);
            resetForm();
          })
          .catch(() => {
            message.error('Failed to update expense.');
          });
      } else {
        // Add new expense
        dispatch(addExpense(expenseData))
          .then(() => {
            message.success('Expense added successfully!');
            resetForm();
          })
          .catch(() => {
            message.error('Failed to add expense.');
          });
      }
    });
  };

  const handleDeleteExpense = (expenseId) => {
    // Show confirmation
    Modal.confirm({
      title: 'Delete Expense',
      content: 'Are you sure you want to delete this expense?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        dispatch(deleteExpense(expenseId))
          .then(() => {
            message.success('Expense deleted successfully!');
          })
          .catch(() => {
            message.error('Failed to delete expense.');
          });
      }
    });
  };

  const resetForm = () => {
    form.resetFields();
    setNewExpense({
      title: '',
      category: '',
      amount: '',
      isCustomCategory: false,
      customCategory: ''
    });
    onToggleAddExpense(false);
  };

  const handleCategoryChange = (value) => {
    form.setFieldsValue({
      isCustomCategory: value === 'Other',
      customCategory: ''
    });
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <span style={{ 
          padding: '4px 8px', 
          borderRadius: '4px', 
          backgroundColor: '#f0f0f0',
          fontSize: '12px'
        }}>
          {category}
        </span>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `₨${amount.toLocaleString()}`
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEditExpense(record)}
            size="small"
          />
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteExpense(record.id)}
            danger
            size="small"
          />
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          Expense Management
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddExpense}
        >
          Add Expense
        </Button>
      </div>

      {/* Add/Edit Expense Form */}
      {(isAddingExpense || editingExpense) && (
        <Card style={{ marginBottom: 24, backgroundColor: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={5} style={{ margin: 0 }}>
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </Title>
            <Button 
              icon={<CloseOutlined />} 
              onClick={resetForm}
            >
              Cancel
            </Button>
          </div>
          
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveExpense}
            initialValues={newExpense}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="title"
                  label="Expense Title"
                  rules={[{ required: true, message: 'Please enter expense title' }]}
                >
                  <Input placeholder="Enter expense title" />
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[{ required: true, message: 'Please select category' }]}
                >
                  <Select
                    placeholder="Select category"
                    onChange={handleCategoryChange}
                    options={EXPENSE_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
                  />
                </Form.Item>
              </Col>
              
              <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.category !== curValues.category}>
                {({ getFieldValue }) => 
                  getFieldValue('category') === 'Other' ? (
                    <Col span={12}>
                      <Form.Item
                        name="customCategory"
                        label="Custom Category"
                        rules={[{ required: true, message: 'Please enter custom category' }]}
                      >
                        <Input placeholder="Enter custom category" />
                      </Form.Item>
                    </Col>
                  ) : null
                }
              </Form.Item>
              
              <Col span={12}>
                <Form.Item
                  name="amount"
                  label="Amount (₨)"
                  rules={[{ required: true, message: 'Please enter amount' }]}
                >
                  <Input type="number" placeholder="Enter amount" />
                </Form.Item>
              </Col>
            </Row>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                type="primary" 
                icon={<SaveOutlined />} 
                htmlType="submit"
              >
                {editingExpense ? 'Update Expense' : 'Save Expense'}
              </Button>
            </div>
          </Form>
        </Card>
      )}

      {/* Expenses List */}
      <div>
        {expenses.length > 0 ? (
          <>
            <Table 
              dataSource={expenses} 
              columns={columns} 
              pagination={false}
              rowKey="id"
            />
            
            {/* Total Expenses */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>Total Expenses:</Text>
                <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                  ₨ {totalExpenses.toLocaleString()}
                </Text>
              </div>
            </div>
          </>
        ) : (
          <Empty
            description={
              <span>
                No expenses found. Get started by adding a new expense.
              </span>
            }
          />
        )}
      </div>
    </Card>
  );
};

export default ExpenseManagement;