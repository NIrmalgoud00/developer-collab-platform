const Organization =
  require("../models/Organization");

const asyncHandler =
  require("../utils/asyncHandler");

const ApiError =
  require("../utils/ApiError");

const User =
  require("../models/User");

const { baseGetActivities } =
  require("../services/baseGetActivities");

const createActivity =
  require("../services/activityService");

const getUserById =
  require("../services/userService");

// Organization
exports.createOrganization =
  asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    const organization =
      await Organization.create({
        name,
        description,
        owner: req.user._id,
        members: [
          {
            user: req.user._id,
            role: "org_admin",
          },
        ],
      });

    await createActivity.logOrganizationCreated(
      organization,
      req.user._id
    )

    res.status(201).json({
      success: true,
      organization,
    });
  });

exports.getOrganizations =
  asyncHandler(async (req, res) => {
    const organizations =
      await Organization.find({
        "owner": req.user._id,
      })
        .populate(
          "owner",
          "name email"
        );

    res.status(200).json({
      success: true,
      organizations,
    });
  });

exports.updateOrganization =
  asyncHandler(async (req, res) => {

    let metadata = {};

    Object.keys(req.body).forEach((key) => {
      if (req.organization[key] !== req.body[key]) {
        metadata[key] = {
          oldValue: req.organization[key],
          newValue: req.body[key]
        };
      }
    });

    Object.assign(
      req.organization,
      req.body
    );

    req.organization.save();

    await createActivity.logOrganizationUpdated(
      req.organization,
      req.user._id,
      metadata
    )

    res.status(201).json({
      success: true,
      organizations: req.organization,
    });
  });

exports.deleteOrganization =
  asyncHandler(async (req, res) => {

    req.organization.archived = true;
    req.organization.save();

    await createActivity.logOrganizationDeleted(
      req.organization,
      req.user._id,
    )

    res.status(201).json({
      success: true,
      message: "Organization deleled successfully"
    });
  });


// Members
exports.inviteMember =
  asyncHandler(async (req, res) => {

    const { email, role } = req.body;

    const organization = req.organization;

    const user =
      await User.findOne({ email });

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    const alreadyMember =
      organization.members.some(
        (member) =>
          member.user.toString() ===
          user._id.toString()
      );

    if (alreadyMember) {
      throw new ApiError(
        400,
        "User already member"
      );
    }

    organization.members.push({
      user: user._id,
      role,
    });

    await organization.save();

    await createActivity.logMemberInvited(
      organization,
      req.user._id,
      user.name
    )

    res.status(200).json({
      success: true,
      message:
        "Member added successfully",
    });
  });

exports.removeMember =
  asyncHandler(async (req, res) => {

    const { email } = req.body;

    const user =
      await User.findOne({ email });

    const noMember =
      req.organization.members.some(
        (member) => {
          member.user.toString() !== user._id.toString()
        }
      );

    if (noMember) {
      throw new ApiError(
        400,
        "User is not member of this organization"
      );
    }

    const members = req.organization.members.filter((member) =>
      member.user.toString() !== user._id.toString()
    );

    req.organization.members = members;

    await req.organization.save();

    await createActivity.logMemberRemoved(
      req.organization,
      req.user._id,
      user.name
    )

    res.status(200).json({
      success: true,
      message:
        "Member removed successfully",
    });
  });

exports.memberRoleUpdate =
  asyncHandler(async (req, res) => {

    const { userId, newRole } = req.body;

    const user =
      await getUserById(userId);

    const noMember =
      req.organization.members.some(
        (member) => {
          member.user.toString() !== user._id.toString()
        }
      );

    if (noMember) {
      throw new ApiError(
        400,
        "User is not member or this organization"
      );
    }

    let oldRole;

    const members = req.organization.members.map((member) => {
      if (member.user.toString() === user._id.toString()) {
        oldRole = member.role;
        return { ...member.toObject(), role: newRole };
      }
      return member;
    }
    );

    req.organization.members = members;

    req.organization.save();

    await createActivity.logMemberRoleUpdate(
      req.organization,
      req.user._id,
      user._id,
      oldRole,
      newRole
    )

    res.status(201).json({
      success: true,
      message: "User role update successfully",
      organizations: req.organization,
    });
  });


// Activity
// get actitvity do later use filter 
exports.getOrganizationActivities =
  asyncHandler(async (req, res) => {

    const result = await baseGetActivities(
      // filter
      {
        organization: req.params.organizationId,
        // action,
      },
      // pagination
      // {
      //   page: req.query.page,
      //   limit: req.query.limit,
      //   sort: {
      //     createdAt: -1,
      //   },
      //   populate: [
      //     {
      //       path: "performedBy",
      //       select: "name email",
      //     },
      //     {
      //       path: "organization",
      //       select: "name",
      //     },
      //     {
      //       path: "project",
      //       select: "name",
      //     },
      //     {
      //       path: "task",
      //       select: "title",
      //     },
      //   ],
      // }
    );

    res.status(201).json({
      success: true,
      result,
    });

  })