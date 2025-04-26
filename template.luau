-- Copyright (c) 2025 Meta Games, LLC. All rights reserved.

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Packages = ReplicatedStorage:WaitForChild("Packages")

local KNIGHT_TYPES = require(ReplicatedStorage:WaitForChild("KNIGHT_TYPES"))
local require = require(Packages:WaitForChild("knight")).require

local <filename> = {} :: KNIGHT_TYPES.KnightClass
<filename>.__index = <filename>

function <filename>:Init()
    return
end

function <filename>:Start()
    return
end

return <filename>
