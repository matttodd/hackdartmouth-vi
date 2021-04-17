import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// redux
import { connect } from "react-redux";
import {
  // Departments
  POST_DEPARTMENT,
  PATCH_DEPARTMENT,
  DELETE_DEPARTMENT,
  // Contact
  POST_CONTACT,
  PATCH_CONTACT,
  DELETE_CONTACT,
} from "../redux/types";
import {
  // departments
  getDepartments,
  patchDepartment,
  postDepartment,
  deleteDepartment,
  // contacts
  getContacts,
  patchContact,
  postContact,
  deleteContact,
  // search
  getSearchedContacts,
} from "../redux/actions/contactActions";
import { clearError, clearAllErrors } from "../redux/actions/uiActions";

// Components
// import ContactEditorModal from "../components/contacts/contactEditorModal";
// import DepartmentList from "../components/contacts/departmentList";
// import DepartmentEditorModal from "../components/contacts/departmentEditorModal";
// import FloatAddButton from "../components/layout/floatAddButton";

// css styles
import "../css/page.css";

class ContactPage extends Component {
  constructor() {
    super();
    this.state = {
      // departments
      confirmDeleteDepartment: false,
      departmentId: "",
      departmentName: "",
      // contacts
      contactDepartmentId: "",
      contactId: "",
      contactName: "",
      contactImgUrl: "",
      contactImgPreviewUrl: "",
      contactImgPostBody: null,
      contactPhone: "",
      contactEmail: "",
      // search
      searchTerm: "",
      // modals
      showContactEditorModal: false,
      showDepartmentEditorModal: false,
    };
  }

  // componentDidMount() {
  //   this.props.clearAllErrors();
  //   this.props.getDepartments();
  //   this.props.getContacts();
  // }

  // componentDidUpdate(prevProps) {
  //   // render action progress and errors
  //   let currentErrors = this.props.ui.errors;
  //   let currentloadingActions = this.props.ui.loadingActions;
  //   let previousLoadingActions = prevProps.ui.loadingActions;
  //   let previousLoadingActionNames = Object.keys(previousLoadingActions);

  //   previousLoadingActionNames.forEach((actionName) => {
  //     if (!currentloadingActions[actionName] && previousLoadingActions[actionName]) {
  //       // if preivousLoadingAction is no longer loading
  //       switch (actionName) {
  //         // departments
  //         case POST_DEPARTMENT:
  //           notification.close(POST_DEPARTMENT);
  //           currentErrors[actionName]
  //             ? notification["error"]({
  //                 message: "Failed to add department",
  //                 description: currentErrors[actionName],
  //                 duration: 0,
  //                 onClose: () => {
  //                   clearError(POST_DEPARTMENT);
  //                 },
  //               })
  //             : notification["success"]({
  //                 message: "Department added!",
  //               });
  //           break;

  //         case PATCH_DEPARTMENT:
  //           notification.close(PATCH_DEPARTMENT);
  //           currentErrors[actionName]
  //             ? notification["error"]({
  //                 message: "Failed to update department",
  //                 description: currentErrors[actionName],
  //                 duration: 0,
  //                 onClose: () => {
  //                   clearError(PATCH_DEPARTMENT);
  //                 },
  //               })
  //             : notification["success"]({
  //                 message: "Department updated!",
  //               });
  //           break;

  //         case DELETE_DEPARTMENT:
  //           notification.close(DELETE_DEPARTMENT);
  //           currentErrors[actionName]
  //             ? notification["error"]({
  //                 message: "Failed to delete department",
  //                 description: currentErrors[actionName],
  //                 duration: 0,
  //                 onClose: () => {
  //                   clearError(DELETE_DEPARTMENT);
  //                 },
  //               })
  //             : notification["success"]({
  //                 message: "Department deleted!",
  //               });
  //           break;

  //         // contacts
  //         case POST_CONTACT:
  //           notification.close(POST_CONTACT);
  //           currentErrors[actionName]
  //             ? notification["error"]({
  //                 message: "Failed to add contact",
  //                 description: currentErrors[actionName],
  //                 duration: 0,
  //                 onClose: () => {
  //                   clearError(POST_CONTACT);
  //                 },
  //               })
  //             : notification["success"]({
  //                 message: "Contact added!",
  //               });
  //           break;

  //         case PATCH_CONTACT:
  //           notification.close(PATCH_CONTACT);
  //           currentErrors[actionName]
  //             ? notification["error"]({
  //                 message: "Failed to update contact",
  //                 description: currentErrors[actionName],
  //                 duration: 0,
  //                 onClose: () => {
  //                   clearError(PATCH_CONTACT);
  //                 },
  //               })
  //             : notification["success"]({
  //                 message: "Contact updated!",
  //               });
  //           break;

  //         case DELETE_CONTACT:
  //           notification.close(DELETE_CONTACT);
  //           currentErrors[actionName]
  //             ? notification["error"]({
  //                 message: "Failed to delete contact",
  //                 description: currentErrors[actionName],
  //                 duration: 0,
  //                 onClose: () => {
  //                   clearError(DELETE_CONTACT);
  //                 },
  //               })
  //             : notification["success"]({
  //                 message: "Contact deleted!",
  //               });
  //           break;
  //         default:
  //           break;
  //       }
  //     }
  //   });
  // }

  // // general form changes
  // handleChange = (event) => {
  //   const value = event.target.value.trim();
  //   this.setState({
  //     [event.target.name]: value,
  //   });

  //   if (event.target.name === "searchTerm") {
  //     this.props.getSearchedContacts(value);
  //   }
  // };

  // // department functions
  // handleAddorEditDepartment = (departmentId = null) => {
  //   this.setState({
  //     showDepartmentEditorModal: true,
  //   });
  //   if (departmentId === null) {
  //     this.setState({
  //       departmentName: "",
  //     });
  //   } else {
  //     const departments = this.props.contacts.departments;
  //     const department = departments.find((d) => d.id === departmentId);
  //     this.setState({
  //       departmentId: departmentId,
  //       departmentName: department.name,
  //     });
  //   }
  // };

  // handlePostOrPatchDepartment = (formValues) => {
  //   const newDepartment = {
  //     name: formValues.departmentName,
  //   };
  //   if (this.state.departmentId === "") {
  //     // posting new department
  //     notification.open({
  //       key: POST_DEPARTMENT,
  //       duration: 0,
  //       message: "Adding department...",
  //       icon: <LoadingOutlined />,
  //     });
  //     this.props.postDepartment(newDepartment);
  //   } else {
  //     // editing exisitng department
  //     notification.open({
  //       key: PATCH_DEPARTMENT,
  //       duration: 0,
  //       message: "Updating department...",
  //       icon: <LoadingOutlined />,
  //     });
  //     this.props.patchDepartment(this.state.departmentId, newDepartment);
  //   }

  //   this.handleCancelAddorEditDepartment();
  // };

  // handleDeleteDepartment = () => {
  //   notification.open({
  //     key: DELETE_DEPARTMENT,
  //     duration: 0,
  //     message: "Deleting department...",
  //     icon: <LoadingOutlined />,
  //   });
  //   this.props.deleteDepartment(this.state.departmentId);
  //   this.handleCancelAddorEditDepartment();
  // };

  // handleCancelAddorEditDepartment = () => {
  //   this.setState({
  //     showDepartmentEditorModal: false,
  //     departmentId: "",
  //     departmentName: "",
  //   });
  // };

  // // contact functions
  // handleAddorEditContact = (departmentId, contactId = null) => {
  //   this.setState({
  //     departmentId: departmentId,
  //     showContactEditorModal: true,
  //   });

  //   if (contactId === null) {
  //     // adding new contact
  //     const defaultContactPic = `https://firebasestorage.googleapis.com/v0/b/cedars-sinai-prd.appspot.com/o/cedars_robot.jpg?alt=media`;
  //     this.setState({
  //       contactDepartmentId: departmentId,
  //       contactId: "",
  //       contactName: "",
  //       contactImgUrl: "",
  //       contactImgPreviewUrl: defaultContactPic,
  //       contactPhone: "",
  //       contactEmail: "",
  //     });
  //   } else {
  //     // editing existing contact
  //     const contacts = this.props.contacts.contacts;
  //     const contact = contacts.find((c) => c.id === contactId);
  //     this.setState({
  //       contactId: contactId,
  //       contactName: contact.name,
  //       contactImgUrl: contact.imgUrl,
  //       contactImgPreviewUrl: contact.imgUrl,
  //       contactDepartmentId: contact.departmentId,
  //       contactPhone: contact.phone,
  //       contactEmail: contact.email,
  //     });
  //   }
  // };

  // handleImageChange = (event) => {
  //   const reader = new FileReader();
  //   const image = event;
  //   const formData = new FormData();
  //   formData.append("image", image, image.name);

  //   reader.onload = function (e) {
  //     let previewImgUrl = e.target.result;
  //     this.setState({
  //       contactImgPreviewUrl: previewImgUrl,
  //       contactImgPostBody: formData,
  //     });
  //   }.bind(this);

  //   reader.readAsDataURL(image);
  // };

  // handlePostOrPatchContact = (formValues) => {
  //   // upload contact image if there is one
  //   if (this.state.contactImgPostBody === null) {
  //     this.handlePostOrPatchContactHelper(formValues, this.state.contactImgUrl);
  //   } else {
  //     axios
  //       .post(`/images`, this.state.contactImgPostBody)
  //       .then((res) => {
  //         this.handlePostOrPatchContactHelper(formValues, res.data.imgUrl);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // };

  // handlePostOrPatchContactHelper = (formValues, contactImgUrl) => {
  //   const newContact = {
  //     departmentId: formValues.contactDepartmentId,
  //     name: formValues.contactName,
  //     phone: formValues.contactPhone,
  //     email: formValues.contactEmail,
  //     imgUrl: contactImgUrl,
  //   };
  //   if (this.state.contactId === "") {
  //     // posting new contact
  //     notification.open({
  //       key: POST_CONTACT,
  //       duration: 0,
  //       message: "Adding contact...",
  //       icon: <LoadingOutlined />,
  //     });
  //     this.props.postContact(newContact);
  //   } else {
  //     // editing exisitng contact
  //     notification.open({
  //       key: PATCH_CONTACT,
  //       duration: 0,
  //       message: "Updating contact...",
  //       icon: <LoadingOutlined />,
  //     });
  //     this.props.patchContact(this.state.contactId, newContact);
  //   }

  //   this.handleCancelAddorEditContact();
  // };

  // handleDeleteContact = () => {
  //   notification.open({
  //     key: DELETE_CONTACT,
  //     duration: 0,
  //     message: "Deleting contact...",
  //     icon: <LoadingOutlined />,
  //   });
  //   this.props.deleteContact(this.state.contactId);
  //   this.handleCancelAddorEditContact();
  // };

  // handleCancelAddorEditContact = () => {
  //   this.setState({
  //     showContactEditorModal: false,
  //     departmentId: "",
  //     contactId: "",
  //     contactName: "",
  //     contactImgUrl: "",
  //     contactImgPreviewUrl: "",
  //     contactImgPostBody: null,
  //     contactDepartmentId: "",
  //     contactPhone: "",
  //     contactEmail: "",
  //   });
  // };

  render() {
    // const { isAdmin } = this.props.user;
    // const { errors, loadingActions } = this.props.ui;
    // const { matchingSearchContacts, departments } = this.props.contacts;
    // const floatAddButtonOptions = {
    //   Department: this.handleAddorEditDepartment,
    //   Contact: this.handleAddorEditContact,
    // };

    return (
      // <div className="page-container">
      //   {isAdmin && <FloatAddButton options={floatAddButtonOptions} />}
      //   <header className="page-header-container">
      //     <div className="page-header-main-items">
      //       <h1>Contacts</h1>
      //       <span className="header-interactive-items">
      //         <Input
      //           style={{ width: 300 }}
      //           id="searchTerm"
      //           name="searchTerm"
      //           type="text"
      //           placeholder="Search contacts by name"
      //           value={this.state.searchTerm}
      //           onChange={this.handleChange}
      //           suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
      //         />
      //       </span>
      //     </div>
      //   </header>
      //   <Layout className="vertical-fill-layout">
      //     <Content className="content-card padded">
      //       <DepartmentEditorModal
      //         // flags
      //         visible={isAdmin && this.state.showDepartmentEditorModal}
      //         isEditingExistingDepartment={this.state.departmentId !== ""}
      //         // department info
      //         departmentName={this.state.departmentName}
      //         handlePostOrPatchDepartment={this.handlePostOrPatchDepartment}
      //         handleDeleteDepartment={this.handleDeleteDepartment}
      //         handleCancelAddorEditDepartment={this.handleCancelAddorEditDepartment}
      //       />

      //       <ContactEditorModal
      //         // flags
      //         visible={isAdmin && this.state.showContactEditorModal}
      //         isEditingExistingContact={this.state.contactId !== ""}
      //         // contact info
      //         departments={departments}
      //         contactId={this.state.contactId}
      //         contactDepartmentId={this.state.contactDepartmentId}
      //         contactName={this.state.contactName}
      //         contactImgPreviewUrl={this.state.contactImgPreviewUrl}
      //         contactPhone={this.state.contactPhone}
      //         contactEmail={this.state.contactEmail}
      //         // form functions
      //         handlePostOrPatchContact={this.handlePostOrPatchContact}
      //         handleDeleteContact={this.handleDeleteContact}
      //         handleCancelAddorEditContact={this.handleCancelAddorEditContact}
      //         handleImageChange={this.handleImageChange}
      //       />
      //       {loadingActions.SET_DEPARTMENTS ? (
      //         <div className="vertical-content vertical-fill-content vertical-centered-content">
      //           <Spin />
      //         </div>
      //       ) : errors.SET_DEPARTMENTS ? (
      //         <div className="vertical-content vertical-fill-content vertical-centered-content">
      //           <Result
      //             status="error"
      //             title="Couldn't get contacts"
      //             subTitle={errors.SET_DEPARTMENTS}
      //           />
      //         </div>
      //       ) : (
      //         <DepartmentList
      //           // data
      //           departments={departments}
      //           contacts={matchingSearchContacts}
      //           // departments
      //           handleAddorEditDepartment={this.handleAddorEditDepartment}
      //           // contacts
      //           handleAddorEditContact={this.handleAddorEditContact}
      //           searchTerm={this.state.searchTerm}
      //         />
      //       )}
      //     </Content>
      //     <Footer style={{ textAlign: "center" }}>DevelopForGood ©2020</Footer>
      //   </Layout>
      // </div>
      <div>FML</div>
    );
  }
}

ContactPage.propTypes = {
  contacts: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  // departments
  getDepartments: PropTypes.func.isRequired,
  postDepartment: PropTypes.func.isRequired,
  patchDepartment: PropTypes.func.isRequired,
  deleteDepartment: PropTypes.func.isRequired,
  // contacts
  getContacts: PropTypes.func.isRequired,
  patchContact: PropTypes.func.isRequired,
  postContact: PropTypes.func.isRequired,
  deleteContact: PropTypes.func.isRequired,
  getSearchedContacts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    contacts: state.contacts,
    user: state.user,
    ui: state.ui,
  };
};

export default connect(mapStateToProps, {
  // departments
  getDepartments,
  postDepartment,
  patchDepartment,
  deleteDepartment,
  // contacts
  getContacts,
  patchContact,
  postContact,
  deleteContact,
  // search
  getSearchedContacts,
  // ui
  clearAllErrors,
  clearError,
})(ContactPage);
