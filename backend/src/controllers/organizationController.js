const Organization = require(
  "../models/Organization"
);

const asyncHandler = require(
  "../utils/asyncHandler"
);

const ApiError = require(
  "../utils/ApiError"
);

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

    res.status(201).json({
      success: true,
      organization,
    });
  });

exports.getOrganizations =
  asyncHandler(async (req, res) => {
    const organizations =
      await Organization.find({
        "members.user": req.user._id,
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



// getById apply

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

    res.status(200).json({
      success: true,
      message:
        "Member added successfully",
    });
  });