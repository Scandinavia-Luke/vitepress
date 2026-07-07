---
layout: doc
title: ConfigureReplaceFloorSwitch
date: 2024-08-26T21:38:36Z
lastmod: 2025-09-15T19:42:23Z
---

# 配置更换楼层交换机

## 一、先找到未配置的新的交换机（H3C）

- 需要的内容有：`交换机配套`，`H3C光模块` <Badge type="danger" text="（光口亮才行）" />。

## 二、找到那台配置的电脑

- `crt`软件通过`console线`连接交换机的`console口`直连进行配置
- `console口`：跟网口长的很像的一个口，有console字样。
- 交换机开机后，连接后进入`配置视图`，然后粘贴改好的内容
  ```Shell
  <h3c>system-view
  [h3c]
  ```

## 三、所有配置内容

```Shell


#
 sysname zyl9F-39-1		# `按楼层分配`
#
stp mode rstp
#
 irf mac-address persistent timer
 irf auto-update enable
 undo irf link-delay
 irf member 1 priority 1
#
loopback-detection interval-time 30
#
 dhcp snooping enable
#
loopback-detection interval-time 35
#
 lldp global enable
#
 password-recovery enable
#
vlan 1
#
vlan 118				# `替换vlan类似的数字`
#
 stp global enable
#
 stp mode rstp
#
interface NULL0
#
int range GigabitEthernet 1/0/1 to GigabitEthernet 1/0/48
  loopback-detection enable vlan 1 to 4094
  loopback-detection action shutdown
  stp port bpdu-protection enable
#
interface Vlan-interface1
 ip address 100.100.39.1 255.255.0.0		# `管理地址，按照原交换机的配置文件更改`
#
interface GigabitEthernet1/0/1
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/2
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/3
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/4
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/5
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/6
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/7
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/8
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/9
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/10
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/11
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/12
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/13
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/14
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/15
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/16
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/17
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/18
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/19
 port access vlan 50
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/20
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/21
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/22
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/23
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/24
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/25
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/26
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/27
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/28
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/29
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/30
 port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/31
 port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/32
 port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/33
 port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/34
 port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/35
 port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/36
 port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/37
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/38
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/39
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/40
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/41
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/42
 port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/43
 port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/44
 port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/45
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/46
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/47
  port access vlan 118
 stp edged-port
 poe enable
#
interface GigabitEthernet1/0/48
 port access vlan 118
 stp edged-port
 poe enable
#
interface Ten-GigabitEthernet1/0/49
 port link-type trunk
 port trunk permit vlan all
dhcp snooping trust
#
interface Ten-GigabitEthernet1/0/50
 port link-type trunk
 port trunk permit vlan all
dhcp snooping trust
#
interface Ten-GigabitEthernet1/0/51
 port link-type trunk
 port trunk permit vlan all
dhcp snooping trust
#
interface Ten-GigabitEthernet1/0/52
 port link-type trunk
 port trunk permit vlan all
 dhcp snooping trust
#
 scheduler logfile size 16
#
line class aux
 user-role network-admin
#
line class vty
 user-role network-operator
#
line aux 0
 user-role network-admin
#
line vty 0 4
 authentication-mode scheme
 user-role network-admin
 user-role network-operator
#
line vty 5 63
 user-role network-operator
#
 ip route-static 0.0.0.0 0 100.100.255.250
#
 ifmonitor crc-error slot 1 high-threshold 1000 low-threshold 100 interval 30
 ifmonitor input-error slot 1 high-threshold 1000 low-threshold 100 interval 30
 ifmonitor output-error slot 1 high-threshold 1000 low-threshold 100 interval 30
#
 ssh server enable
#
radius scheme system
 user-name-format without-domain
#
domain system
#
 domain default enable system
#
role name level-0
 description Predefined level-0 role
#
role name level-1
 description Predefined level-1 role
#
role name level-2
 description Predefined level-2 role
#
role name level-3
 description Predefined level-3 role
#
role name level-4
 description Predefined level-4 role
#
role name level-5
 description Predefined level-5 role
#
role name level-6
 description Predefined level-6 role
#
role name level-7
 description Predefined level-7 role
#
role name level-8
 description Predefined level-8 role
#
role name level-9
 description Predefined level-9 role
#
role name level-10
 description Predefined level-10 role
#
role name level-11
 description Predefined level-11 role
#
role name level-12
 description Predefined level-12 role
#
role name level-13
 description Predefined level-13 role
#
role name level-14
 description Predefined level-14 role
#
user-group system
#
local-user admin class manage
 password sim 2012@xxk
 service-type telnet http https ssh terminal
 authorization-attribute user-role network-admin
 authorization-attribute user-role network-operator
#
local-user xxk class manage
 password sim 2012@xxk
 service-type telnet http https ssh terminal
 authorization-attribute user-role network-admin
 authorization-attribute user-role network-operator
#
return

```

## 四、以上配置文件修改后，注释文字删掉再粘贴至进去

- 粘贴完后，进行保存
  ```Shell
  [zyl9F-39-1]quit
  <zyl9F-39-1>save
  ```
- 查看所有配置内容
  ```Shell
  [zyl9F-39-1]display current-configuration
  ```
- 如有需要，清空配置/重启
  ```Shell
  [zyl9F-39-1]reset saved-configuration
  The saved configuration file will be erased. Are you sure? [Y/N]:y	# `这里输入Y进行确认清除`
  [zyl9F-39-1]reboot	# `重启设备`
  ```
  ‍

